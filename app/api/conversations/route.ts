import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import type { NextApiResponse } from 'next';
import { pusherServer } from '@/app/libs/pusher';

export async function POST(
	request: Request,
	res: NextApiResponse
): Promise<NextResponse> {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse('Invalid data', { status: 400 });
		}

		if (isGroup) {
			const newConversation = await prisma.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [
							...members.map((member: { value: string }) => ({
								id: member.value
							})),
							{
								id: currentUser.id
							}
						]
					}
				},
				include: {
					users: true
				}
			});

			newConversation.users.forEach(user => {
				if (user.email) {
					void pusherServer.trigger(
						user.email,
						'conversation:new',
						newConversation
					);
				}
			});

			return NextResponse.json(newConversation);
		}

		const existingConversations = await prisma.conversation.findMany({
			where: {
				OR: [
					{
						userIds: {
							equals: [currentUser.id, userId]
						}
					},
					{
						userIds: {
							equals: [userId, currentUser.id]
						}
					}
				]
			}
		});

		const singleConversation = existingConversations[0];

		if (singleConversation) {
			return NextResponse.json(singleConversation);
		}

		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id
						},
						{
							id: userId
						}
					]
				}
			},
			include: {
				users: true
			}
		});

		newConversation.users.map(async user => {
			if (user.email) {
				await pusherServer.trigger(
					user.email,
					'conversation:new',
					newConversation
				);
			}
		});

		return NextResponse.json(newConversation);
	} catch (error) {
		return new NextResponse('Internal Error', { status: 500 });
	}
}
