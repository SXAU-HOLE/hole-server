export const createResponse = <T extends object>(message: string, data: T = {} as T, code = 200) => {
  return {
    data,
    message,
    code,
  }
}
