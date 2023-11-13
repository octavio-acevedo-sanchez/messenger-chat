'use client';

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import type { SubmitHandler, FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { CldUploadButton } from 'next-cloudinary';

const Form = (): React.ReactNode => {
	const { conversationId } = useConversation();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			message: ''
		}
	});

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setValue('message', '', { shouldValidate: true });

		await axios.post('/api/messages', {
			...data,
			conversationId
		});
	};

	const handleUpload = async (result: any): Promise<void> => {
		await axios.post('/api/messages', {
			image: result?.info?.secure_url,
			conversationId
		});
	};

	return (
		<div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
			<CldUploadButton
				options={{ maxFiles: 1 }}
				onUpload={handleUpload}
				uploadPreset='oev788zl'
			>
				<HiPhoto size={30} className='text-sky-500' />
			</CldUploadButton>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex items-center gap-2 lg:gap-4 w-full'
			>
				<MessageInput
					id='message'
					register={register}
					errors={errors}
					required
					placeholder='Write a message'
				/>
				<button
					type='submit'
					className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'
				>
					<HiPaperAirplane size={18} className='text-white' />
				</button>
			</form>
		</div>
	);
};

export default Form;
