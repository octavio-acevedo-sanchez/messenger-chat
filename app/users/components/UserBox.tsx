'use client';

import { useCallback, useState } from 'react';
import Avatar from '@/app/components/Avatar';
import LoadingModal from '@/app/components/LoadingModal';

import { useRouter } from 'next/navigation';
import type { User } from '@prisma/client';
import axios from 'axios';

interface UserBoxProps {
	data: User;
}

const UserBox = ({ data }: UserBoxProps): React.ReactNode => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = useCallback(async () => {
		setIsLoading(true);

		await axios
			.post('/api/conversations', {
				userId: data.id
			})
			.then(data => {
				router.push(`/conversations/${data.data.id}`);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [data, router]);

	return (
		<>
			{isLoading && <LoadingModal />}
			<div
				className='w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer'
				onClick={() => {
					void handleClick();
				}}
			>
				<Avatar user={data} />
				<div className='min-w-0 flex-1'>
					<div className='focus:outline-none'>
						<div className='flex justify-between items-center mb-1'>
							<p className='text-sm font-medium text-gray-900'>{data.name}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserBox;
