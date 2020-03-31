// to do
class IfBlock {
    constructor({ condition = '', yes = [], no = [], name='if' }) {
        this.type = BLOCK_TYPES.CONTROL
        this.name = name
        this.condition = condition
        this.yes = yes
        this.no = no
    }
}

const DOUBLE_QUOTE = '"'
const SINGLE_QUOTE = "'"
const SMARTY_BLOCK_BEGIN = '{#'
const SMARTY_BLOCK_END = '#}'
const SLASH = '\\'

const BLOCK_TYPES = {
    CONTROL: 'CONTROL'
}

class SmartyParser {
    constructor(doc) {
        this.doc = doc
        this.cursor = 0
        this.result = []
        this.markStack = []
        this.blockStack = []
    }

    process(context) {
        while (this.cursor < this.doc.length) {
            this.skipSpace()
            if (this.cursor < this.doc.length) {
                this.processBlock(context)
            }
        }
    }

    parse() {
        this.cursor = 0
        this.result = []
        this.markStack = []
        this.blockStack = []
        this.process(this.result)
    }

    skipSpace() {
        while (/[\s\n\r]/.test(this.curChar)) {
            if (!this.step()) return false
        }
        return true
    }

    step(size = 1) {
        this.cursor += size
        return this.cursor && this.cursor < this.doc.length
    }

    get curChar() {
        return this.doc[this.cursor]
    }

    get markStackLast() {
        return this.markStack[this.markStack.length - 1]
    }

    get blockStackLast() {
        return this.blockStack[this.blockStack.length - 1]
    }

    processChar() {
        const startIndex = this.cursor
        while (/[^\s\n\r]/.test(this.curChar)) {
            this.step()
        }
        return this.doc.substring(startIndex, this.cursor)
    }

    processBlock(context) {
        let str = this.processChar()
        if (/^{#/.test(str)) {
            /^{#\\/.test(str) ? this.processControlEndBlock(str) : this.processControlBlock(str, context)
        }
    }

    processExpression() {
        try {
            const startIndex = this.cursor
            while (this.step()) {
                const markStackLast = this.markStackLast
                if (this.doc.substring(this.cursor, this.cursor + 2) === '#}' && markStackLast === '{#') {
                    this.markStack.pop()
                    break
                } else {
                    const curChar = this.curChar
                    if (curChar === SLASH) {
                        this.step()
                    } else {
                        if (curChar === SINGLE_QUOTE && [DOUBLE_QUOTE, SMARTY_BLOCK_BEGIN].indexOf(markStackLast) === -1) {
                            if (markStackLast === SINGLE_QUOTE) {
                                this.markStack.pop()
                                this.step()
                            } else {
                                this.markStack.push(curChar)
                            }
                        } else if (curChar === DOUBLE_QUOTE && [SINGLE_QUOTE, SMARTY_BLOCK_BEGIN].indexOf(markStackLast) === -1) {
                            if (markStackLast === DOUBLE_QUOTE) {
                                this.markStack.pop()
                                this.step()
                            } else {
                                this.markStack.push(curChar)
                            }
                        }
                    }
                }
            }
            return this.doc.substring(startIndex, this.cursor)
        } finally {
            this.step(2)
        }
    }

    processControlBlock(str, context) {
        const directive = /^[^#]*/.exec(str.substring(2))[0]
        this.markStack.push(SMARTY_BLOCK_BEGIN)
        const blockStackLast = this.blockStackLast
        switch (directive) {
            case 'if':
                const ifBlock = new IfBlock({ condition: this.processExpression() })
                this.blockStack.push(ifBlock)
                context.push(ifBlock)
                this.process(ifBlock.yes)
                break
            case 'elseif':
                if (blockStackLast && blockStackLast.type === BLOCK_TYPES.CONTROL && ['if', 'elseif'].indexOf(blockStackLast.name) !== -1) {
                    if (blockStackLast.name === 'elseif') {
                        this.blockStack.pop()
                    }
                    const ifBlock = new IfBlock({ condition: this.processExpression(), name: 'elseif' })
                    this.blockStack.push(ifBlock)
                    blockStackLast.no.push(ifBlock)
                    this.process(ifBlock.yes)
                }
            case 'else':
                if (blockStackLast && blockStackLast.type === BLOCK_TYPES.CONTROL && ['if', 'elseif'].indexOf(blockStackLast.name) !== -1) {
                    if (blockStackLast.name === 'elseif') {
                        this.blockStack.pop()
                    }
                    this.process(blockStackLast.no)
                }

        }
    }

    processControlEndBlock(str) {
        const match = /{#\\(.*?)#}/.exec(str)
        if (match) {
            this.step(match[0].length - str.length)
            const blockStackLast = this.blockStackLast
            if (blockStackLast && blockStackLast.type === BLOCK_TYPES.CONTROL && blockStackLast.name === match[1].trim()) {
                this.blockStack.pop()
            }
        }
    }

}
