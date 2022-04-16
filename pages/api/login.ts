import type { NextApiRequest, NextApiResponse } from 'next';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@firebase/index';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { email, password } = req.body;
	try {
		signInWithEmailAndPassword(auth, email, password)
			.then(async userCredentials => {
				const { user } = userCredentials;
				res.status(200).json({ id: user.uid });
			})
			.catch(() => {
				res.status(400).json({ id: null });
			});
	} catch (e) {
		res.status(400).json({ id: null });
	}
}
