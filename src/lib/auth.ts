import * as jwt from 'jsonwebtoken';

export async function auth(request: Request): Promise<string> {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    throw new Error('Authorization header is required');
  }

  const token = authorization.split(' ')[1];
  
  if (!token) {
    throw new Error('Bearer token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
