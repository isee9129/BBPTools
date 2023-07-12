function gcd(a, b){  // 最大公約数
    if(a < 0) a = -a;
    if(b < 0) b = -b;
    if(a < b) [a, b] = [b, a];
    if(b == 0) return a;
    while(a % b != 0){
        [a, b] = [b, a%b]
    }
    return b
}

function lcm(a, b){  // 最小公倍数
    d = gcd(a, b)
    if(d == 0) return 0;
    return a / d * b
}

function print(x) {
    console.log(`${x}`)
}

// 有理数クラス
class Fraction{
    constructor(numerator, denominator){  // n/m → Fraction(n, m)
        this.nume = BigInt(numerator)
        this.deno = BigInt(denominator)
        this.reduce()
    }
    toString(){
        return `${this.nume} / ${this.deno}`
    }
    reduce(){  // 約分
        const d = gcd(this.nume, this.deno)
        this.nume /= d
        this.deno /= d
    }
    add(x){
        let nume2 = x.nume
        let deno2 = x.deno
        const d = gcd(deno2, this.deno)
        this.nume = deno2 / d * this.nume + this.deno / d * nume2
        this.deno /= d
        this.deno *= deno2
        this.reduce()
    }
    sub(x){
        this.add(new Fraction(-x.nume, x.deno))
    }
    mul(x){
        let nume2 = x.nume
        let deno2 = x.deno
        const d1 = gcd(nume2, this.deno)
        const d2 = gcd(deno2, this.nume)
        if(d1 == 0 || d2 == 0){
            return new Fraction(0, 1)
        }
        nume2 /= d1
        this.deno /= d1
        deno2 /= d2
        this.nume /= d2
        this.nume *= nume2
        this.deno *= deno2
    }
    div(x){
        this.mul(new Fraction(x.deno, x.nume))
    }
    getFloat(len){  // 小数に変換  len : 小数以下の桁数
        let nume = this.nume
        if(nume < 0) nume = -nume;
        nume %= this.deno
        let fracpart = BigInt(0)
        for(let i = 0; i < len+1; i++){
            fracpart *= BigInt(10)
            nume *= BigInt(10)
            fracpart += nume / this.deno
            nume %= this.deno
        }
        if(fracpart % BigInt(10) >= 5){
            fracpart += BigInt(10)
        }
        fracpart /= BigInt(10)
        return parseFloat(`${this.getIntPart()}.${fracpart}`)
    }
    getIntPart(){
        return this.nume / this.deno
    }
}


document.getElementsByTagName('body').innertext = "hoge"