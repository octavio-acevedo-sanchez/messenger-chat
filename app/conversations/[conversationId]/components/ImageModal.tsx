'use client';

import Modal from '@/app/components/Modal';
import Image from 'next/image';

interface ImageModalProps {
	isOpen?: boolean;
	src?: string | null;
	onClose: () => void;
}

const ImageModal = ({
	isOpen,
	src,
	onClose
}: ImageModalProps): React.ReactNode => {
	if (!src) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className='w-80 h-80'>
				<Image alt='Image' className='object-cover' fill src={src} />
			</div>
		</Modal>
	);
};

export default ImageModal;
