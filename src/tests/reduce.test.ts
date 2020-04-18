// Objectにuniqueなidを持たせる
interface ObjectConstructor {
    id: any
}
(function () {
    if (typeof Object.id == "undefined") {
        var id = 0;
        Object.id = function (o) {
            if (typeof o.__uniqueid == "undefined") {
                Object.defineProperty(o, "__uniqueid", {
                    value: ++id,
                    enumerable: false,
                    // This could go either way, depending on your 
                    // interpretation of what an "id" is
                    writable: false
                });
            }
            return o.__uniqueid;
        };
    }
})();

let A = [1, 2, 3]
const arr = {}
console.log('arr ', Object.id(arr))
A.reduce((pValue, cValue) => {
    console.log(Object.id(pValue))
    pValue[cValue] = 1
    return pValue
}, arr)