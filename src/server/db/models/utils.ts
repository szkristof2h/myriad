export interface MongooseModel {
  _id: string
  _v: string
  save: () => Promise<void>
}
