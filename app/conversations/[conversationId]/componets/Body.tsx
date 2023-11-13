'use client';

import { useEffect, useRef, useState } from 'react';
import type { FullMessageType } from '@/app/types';
import useConversation from '@/app/hooks/useConversation';
import MessageBox from './MessageBox';
import axios from 'axios';

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
