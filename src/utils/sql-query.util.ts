import { Like } from 'typeorm'

export type ObjectProtsProps = Record<string, any>

/**
 * typeorm查询的最后一公里
 */
export default class SqlQueryUtil {
  /**
   * 快速给Like查询, 用于find.where
   * @param data 查询的数据
   * @param keys 需要like查询的键, 默认: Object.keys(data)
   * @returns
   */
  static Object2Like<T extends ObjectProtsProps>(data: T, keys: Array<keyof T> = Object.keys(data)) {
    const res: any = {}
    for (const key of keys) {
      if (data[key]) {
        res[key] = Like(`%${data[key]}%`)
      }
    }
    return res
  }
}
