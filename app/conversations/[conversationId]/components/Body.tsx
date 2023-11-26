'use client';

import { useEffect, useRef, useState } from 'react';
import type { FullMessageType } from '@/app/types';
import useConversation from '@/app/hooks/useConversation';
import { pusherClient } from '@/app/libs/pusher';
import MessageBox from './MessageBox';
import axios from 'axios';
import { find } from 'lodash';

interface BodyProps {
	initialMessages: FullMessageType[];
}

const Body = ({ initialMessages }: BodyProps): React.ReactNode => {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);

	const { conversationId } = useConversation();

	useEffect(() => {
		const conversationSeen = async (): Promise<void> => {
			await axios.post(`/api/conversations/${conversationId}/seen`);
		};

		void conversationSeen();
	}, [conversationId]);

	useEffect(() => {
		pusherClient.subscribe(conversationId);
		bottomRef?.current?.scrollIntoView();

		const messageHandler = async (message: FullMessageType): Promise<void> => {
			await axios.post(`/api/conversations/${conversationId}/seen`);

			setMessages(current => {
				if (find(current, { id: message.id })) {
					return current;
				}

				return [...current, message];
			});

			bottomRef?.current?.scrollIntoView();
		};

		const updateMessageHandler = (newMessage: FullMessageType): void => {
			setMessages(current =>
				current.map(currentMessage => {
					if (currentMessage.id === newMessage.id) {
						return newMessage;
					}

					return currentMessage;
				})
			);
		};

		pusherClient.bind('messages:new', messageHandler);
		pusherClient.bind('message:update', updateMessageHandler);

		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind('messages:new', messageHandler);
			pusherClient.unbind('message:update', updateMessageHandler);
		};
	}, [conversationId]);

	return (
		<div className='flex-1 overflow-y-auto'>
			{messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))}
			<div ref={bottomRef} className='pt-24' />
		</div>
	);
};

export default Body;
