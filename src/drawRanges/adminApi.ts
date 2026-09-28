import { mapRange, rangeToDto, RangeNotFoundError } from "@/drawRanges/api";
import type { ActionDto, PokerRangeDto } from "@/drawRanges/dto";
import type { PokerRange } from "@/drawRanges/model";

export { RangeNotFoundError };

const URL = import.meta.env.VITE_API_URL ?? "";

export class InvalidAdminPasswordError extends Error {}
export class AdminSessionExpiredError extends Error {}

export const ADMIN_SESSION_EXPIRED_EVENT =
  "poker-trainer-admin-session-expired";

const throwIfUnauthorized = (response: Response) => {
  if (response.status === 401) {
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
    throw new AdminSessionExpiredError();
  }
};

export const checkAdminSession = async (): Promise<boolean> => {
  const response = await fetch(`${URL}/api/admin/auth/session`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return false;
  }
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return true;
};

export const loginAdmin = async (password: string): Promise<void> => {
  const response = await fetch(`${URL}/api/admin/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (response.status === 401) {
    throw new InvalidAdminPasswordError();
  }
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
};

export const getAdminRange = async (spotKey: string): Promise<PokerRange> => {
  const response = await fetch(
    `${URL}/api/admin/ranges/range?spotKey=${encodeURIComponent(spotKey)}`,
    { credentials: "include" },
  );

  if (response.status === 404) {
    throw new RangeNotFoundError(`No range found for spot: ${spotKey}`);
  }
  throwIfUnauthorized(response);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const range: PokerRangeDto = await response.json();
  return mapRange(range as Record<string, ActionDto>);
};

export const updateAdminRange = async (
  spotKey: string,
  range: PokerRange,
): Promise<PokerRange> => {
  const response = await fetch(
    `${URL}/api/admin/ranges/range?spotKey=${encodeURIComponent(spotKey)}`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rangeToDto(range)),
    },
  );

  throwIfUnauthorized(response);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const updatedRange: PokerRangeDto = await response.json();
  return mapRange(updatedRange as Record<string, ActionDto>);
};
