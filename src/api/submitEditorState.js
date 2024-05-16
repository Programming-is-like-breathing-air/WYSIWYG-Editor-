// // pages/api/submitEditorState.js
//
// import { PrismaClient } from '@prisma/client';
//
// const prisma = new PrismaClient();
//
// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         const { editorState } = req.body;
//         try {
//             const postSubmit = await prisma.post.create({
//                 data: {
//                     // You might want to adjust these fields based on your database model
//                     title: "Example Post",
//                     info: editorState,
//                 },
//             });
//             res.status(200).json(postSubmit);
//         } catch (error) {
//             console.error('Error in /api/submitEditorState:', error);
//             res.status(500).json({ error: 'Error creating post' });
//         }
//     } else {
//         // Handle any other HTTP methods
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
