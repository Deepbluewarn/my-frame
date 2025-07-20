'use server'

import { getSession } from "@auth0/nextjs-auth0";
import { actionGetUserIdBySub } from "@/actions/user";

/**
 * 로그인이 필요한 작업을 처리하는 래퍼 함수
 * @param action 실행할 함수
 * @param authRequiredMessage 로그인이 필요할 때 표시할 메시지
 * @returns 로그인 상태에 따라 원본 함수의 결과 또는 예외
 */
export async function requireAuth<T>(
  action: (userId: string, ...args: any[]) => Promise<T>,
  authRequiredMessage: string = '이 작업을 수행하려면 로그인이 필요합니다.'
) {
  return async (...args: any[]): Promise<T> => {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error(authRequiredMessage);
    }

    const userId = await actionGetUserIdBySub(session.user.sub);
    if (!userId) {
      throw new Error('사용자 정보를 찾을 수 없습니다. 계정 정보를 확인해 주세요.');
    }

    return action(userId, ...args);
  };
}

/**
 * 소유자 확인이 필요한 작업을 처리하는 래퍼 함수
 * @param action 실행할 함수
 * @param ownerCheck 소유자 확인 함수 (userId, resourceId -> boolean)
 * @param authRequiredMessage 로그인이 필요할 때 표시할 메시지
 * @param ownerRequiredMessage 소유자가 아닐 때 표시할 메시지
 * @returns 권한에 따라 원본 함수의 결과 또는 예외
 */
export async function requireOwner<T>(
  action: (userId: string, ...args: any[]) => Promise<T>,
  ownerCheck: (userId: string, resourceId: string) => Promise<boolean>,
  authRequiredMessage: string = '이 작업을 수행하려면 로그인이 필요합니다.',
  ownerRequiredMessage: string = '이 작업은 소유자만 수행할 수 있습니다.'
) {
  return async (resourceId: string, ...args: any[]): Promise<T> => {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error(authRequiredMessage);
    }

    const userId = await actionGetUserIdBySub(session.user.sub);
    if (!userId) {
      throw new Error('사용자 정보를 찾을 수 없습니다. 계정 정보를 확인해 주세요.');
    }

    const isOwner = await ownerCheck(userId, resourceId);
    if (!isOwner) {
      throw new Error(ownerRequiredMessage);
    }

    return action(userId, resourceId, ...args);
  };
}

/**
 * 조회 작업을 위한 래퍼 함수 (비로그인 사용자도 허용)
 * @param action 실행할 함수
 * @returns 로그인 상태와 무관하게 원본 함수의 결과
 */
export async function allowAnonymousView<T>(
  action: (userId?: string, ...args: any[]) => Promise<T>
) {
  return async (...args: any[]): Promise<T> => {
    const session = await getSession();
    const userId = session?.user ? await actionGetUserIdBySub(session.user.sub) : undefined;
    
    return action(userId, ...args);
  };
}
