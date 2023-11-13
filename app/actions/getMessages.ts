import prisma from '@/app/libs/prismadb';
import type { FullMessageType } from '../types';

const getMessages = async (
	conversationId: string
): Promise<FullMessageType[]> => {
	try {
		const messages = await prisma.message.findMany({
			where: {
				conversationId
			},
			include: {
				sender: true,
				seen: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		});

		return messages;
	} catch (error) {
		return [];
	}
};

export default getMessages;
