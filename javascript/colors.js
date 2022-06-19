const {ColorTranslator} = require('colortranslator')
let x = Math.random

function GetColor(Property){
    let DynID = Property.findIndex(item => item.key == 'dynamics')
    let ConstID = Property.findIndex(item => item.key == 'constantValue')
    if (DynID >= 0) {
        let ProbTableID = Property[DynID].value.items.findIndex(item => item.key == 'probabilityTables')
            if (ProbTableID >= 0) Property[DynID].value.items.shift()
    }
    let Palette = []
  
    if(DynID >= 0){
        let Dynamics = Property[DynID].value.items
        let DynTimes = Dynamics[0].value.items
        let DynColors = Dynamics[1].value.items
        for(let i = 0; i < DynTimes.length; i++){
            Palette.push(new ColorHandler(DynColors[i], DynTimes[i]))
        }
    } else if(ConstID >= 0){
        let Constant = Property[ConstID].value
        Palette.push(new ColorHandler(Constant))
    }
    return Palette
}

function ToBG(Palette){
    if(Palette.length == 1){
        return `${Palette[0].obj.RGB} ${Palette[0].time}%`
    } else if (Palette.length > 1){
        let result = []
        for(let i = 0; i < Palette.length; i++){
            result.push(`${Palette[i].obj.RGB} ${Math.round(Palette[i].time * 100)}%`)
        }
        return `linear-gradient(0.25turn,${result.join(', ')})`
    }
}

class ColorHandler {
    constructor(vec4 = [x(),x(),x(),x()],time = 0){
        this.vec4 = vec4
        this.time = time
        this.obj = new ColorTranslator({
            r:vec4[0]*255,
            g:vec4[1]*255,
            b:vec4[2]*255,
            a:vec4[3]
        })
    }

    input(hex,alpha = this.obj.A){
        this.obj = new ColorTranslator(hex)
        this.obj.setA(alpha)
        this.vec4 = [
            this.obj.R/255,
            this.obj.G/255,
            this.obj.B/255,
            alpha
        ]
    }
}

module.exports = {
    ColorHandler, ToBG, GetColor
}