var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function absorbRejectedPromises(value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield value;
        }
        catch (_) {
            // Nothing to do here.
        }
    });
}
export default {
    nullary: function nullaryReturnThis() {
        return this;
    },
    unary: function unaryReturnThis(unusedArgument) {
        absorbRejectedPromises(unusedArgument);
        return this;
    },
    binary: function unaryReturnThis(unusedArgument, secondUnusedArgument) {
        absorbRejectedPromises(unusedArgument);
        absorbRejectedPromises(secondUnusedArgument);
        return this;
    },
    any: function anyReturnThis(...unusedArguments) {
        unusedArguments.forEach(absorbRejectedPromises);
        return this;
    }
};
