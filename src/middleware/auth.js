import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function verifyAuth(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return { authenticated: false, error: 'No token provided' };
    }

    const verified = await jwtVerify(token, secret);
    return { authenticated: true, user: verified.payload };
  } catch (error) {
    return { authenticated: false, error: error.message };
  }
}

export function checkRole(requiredRoles) {
  return (user) => {
    if (!user || !user.role) {
      return false;
    }
    return requiredRoles.includes(user.role);
  };
}

export const roleHierarchy = {
  admin: 4,
  district: 3,
  tehsil: 2,
  sarpanch: 1,
  citizen: 0
};

export function canApprove(userRole, currentLevel) {
  const roleMap = {
    sarpanch: 'sarpanch',
    tehsil: 'tehsil',
    district: 'district',
    admin: 'admin'
  };

  const userLevel = roleMap[userRole];
  const currentLevelHierarchy = roleHierarchy[currentLevel] || 0;
  const userLevelHierarchy = roleHierarchy[userLevel] || 0;

  return userLevelHierarchy > currentLevelHierarchy;
}
