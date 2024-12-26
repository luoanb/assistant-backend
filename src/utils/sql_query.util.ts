import { Like } from 'typeorm'

export type ObjectProtsProps = Record<string, any>

/**
 * 快速给Like查询
 * @param data
 * @param keys
 * @param base 用于关联查询指定关联表例如:`table.`
 * @returns
 */
export function LikeObjectProts<T extends ObjectProtsProps>(data: T, keys: Array<keyof T>, base = '') {
  const res: any = {}
  for (const key of keys) {
    if (data[key]) {
      res[base + (key as string)] = Like(`%${data[key]}%`)
    }
  }
  return res
}
