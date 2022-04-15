import type { NextApiRequest, NextApiResponse } from 'next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '@firebase/index';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { name, email, password } = req.body;
	console.log(req.body);
	try {
		createUserWithEmailAndPassword(auth, email, password)
			.then(async userCredentials => {
				await setDoc(doc(db, 'users', userCredentials.user.uid), {
					email,
					name,
				});
				res.status(200).json({ id: userCredentials.user.uid });
			})
			.catch(() => {
				res.status(400).json({ id: null });
			});
	} catch (e) {
		res.status(400).json({ id: null });
	}
}
