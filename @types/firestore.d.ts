
declare namespace FirestoreQuery {
    type CompanyData = {
        Date: any,
        CR: number
        DoD: null | number
        DoDP: null | number
        HP: number
        LP: number
        OR: number
        Rev: number
    }
    type UpOrDownFiveCompanies = (CompanyData & { name: string })[]
}