export declare namespace Kabutan {
    enum OriginalData {
        date = "日付",
        OR = "始値",
        HP = "高値",
        LP = "安値",
        CR = "終値",
        DoD = "前日比",
        DoDP = "前日比％",
        Rev = "売買高(株)"
    }
    type OriginalType = "日付" | "始値" | "高値" | "安値" | "終値" | "前日比" | "前日比％" | "売買高(株)"
    type Data = {
        date: string
        OR: number
        HP: number
        LP: number
        CR: number
        DoD: number
        DoDP: number
        Rev: number
    }
}