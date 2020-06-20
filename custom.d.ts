declare module "*.svg" {
  const content: any
  export default content
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string
      displayName?: string
    }
  }
  export interface Response {
    dataToSendBack?: any // TODO: add dynamic type
  }
}
