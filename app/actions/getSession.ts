import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function getSession(): Promise<Session | null> {
	return await getServerSession(authOptions);
}
