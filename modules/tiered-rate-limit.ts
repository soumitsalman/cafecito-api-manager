import {ZuploContext, ZuploRequest} from "@zuplo/runtime";

export function rateLimit(request: ZuploRequest, context: ZuploContext) {
  const user = request.user;
  // TODO: change the rate limit to hour
  // premium customers get 1000 requests per minute
  if (user.data.user_type === "baller") {
    return {
      key: user.sub,
      requestsAllowed: 1000,
      timeWindowMinutes: 1,
    };
  }
  // base customers get 10 requests per minute
  if (user.data.user_type === "broke") {
    return {
      key: user.sub,
      requestsAllowed: 10,
      timeWindowMinutes: 1,
    };
  }
  // everybody else gets 5 requests per minute
  return {
    key: user.sub,
    requestsAllowed: 5,
    timeWindowMinutes: 1,
  };
}