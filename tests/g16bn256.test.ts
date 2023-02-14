import { expect } from 'chai'
import { FQ12 } from '../src/ec/bn256'

import { G16BN256, Proof, VerifyingKey } from '../src/zk/g16bn256'

import { method, assert, SmartContract, FixedArray } from 'scrypt-ts'

class G16BN256Test extends SmartContract {
    @method()
    public verifyProof(
        inputs: FixedArray<bigint, 1>,
        proof: Proof,
        vk: VerifyingKey
    ) {
        assert(G16BN256.verify(inputs, proof, vk))
    }
}

describe('Heavy: Test G16 on BN256', () => {
    let g16bn256test = undefined

    before(async () => {
        await G16BN256Test.compile()
        g16bn256test = new G16BN256Test()
    })

    it('should pass verify proof', () => {
        const proof: Proof = {
            a: {
                x: 7806128724954406153003087349245052808907874731125160675685055513021649701071n,
                y: 13560136598824913615836434187917186176341544027630223448955379574818038226068n,
            },
            b: {
                x: {
                    x: 16314915096215070608630915566403842777437950463675598635370026669394520004697n,
                    y: 7903344677613886478108825830167830286839488887561066139172695998961846272321n,
                },
                y: {
                    x: 10521184056941233082868718247974795348870819939033128581405789049939677485519n,
                    y: 17506458731737841148046536442593207259057442987730664427022256323577114159030n,
                },
            },
            c: {
                x: 17007152834503019054209761811816767423299798410436681710465919276833984219904n,
                y: 16044329001077356785715212962413301744016427021614283058351137082462710413607n,
            },
        }

        // You can also precalculate miller(beta, alpha) with the contract function itself:
        //let millerb1a1 = BN256Pairing.miller(
        //        BN256.createTwistPoint(vkBeta),
        //        BN256.createCurvePoint(vkAlpha)
        //        )

        const millerb1a1: FQ12 = {
            x: {
                x: {
                    x: 2127356783905559593272756835978861745876488732674186717002137844997639056324n,
                    y: -25399583956667205141837684477276819181966124473649400873238383836865208168593n,
                },
                y: {
                    x: -16711428091461918511096809274034428548482845969609499954997089082175334525717n,
                    y: -12211292625401886850243523359594870225579183334795450974496925675022465811288n,
                },
                z: {
                    x: -64589125938171024488928895725585582843215161613769324288899182089035139680481n,
                    y: 100585451108012376489520314045669715950877884161284756461348374288652621138550n,
                },
            },
            y: {
                x: {
                    x: 17128697032009708071441534394297333564991166476249799533395840138644743465049n,
                    y: 2016396721973396327764393052769706730962680626481266267397819585211285681784n,
                },
                y: {
                    x: -15543929344890631450579637055954481150167653191503975534944704416060157555582n,
                    y: -86216297469984927837207428415834555765584774641150438316220469703187627590807n,
                },
                z: {
                    x: 174445358656777515364411221148061800312292041223077934483774996724048396434783n,
                    y: 225468647982510873424836217733874917878784354743069798294557806978737945535998n,
                },
            },
        }

        const vk: VerifyingKey = {
            millerb1a1: millerb1a1,
            gamma: {
                x: {
                    x: 13335031872417311849779127630502011627437554288422677876781944585527868668585n,
                    y: 5223095696057091582655469238561585158494674803512963185004264677386756379623n,
                },
                y: {
                    x: 20595548129338113712057759196955778535909211663284999614278491265738150759238n,
                    y: 20364424531683528595999381647539303237259142313533039788611637721329568723477n,
                },
            },
            delta: {
                x: {
                    x: 9722307981881809397986408569806892307835288561173519518698733186286772131696n,
                    y: 16054678695513596161573036600760532082497929200301034487129616509615992952407n,
                },
                y: {
                    x: 5781779700823312892738422717828104157084932532659507238642231071738461066662n,
                    y: 16067588491129660587367595772737783657596936309678675563152161776652418985494n,
                },
            },
            gammaAbc: [
                {
                    x: 1434814675111671141117978071049776265326497986933100913076278755091641359582n,
                    y: 11820631828686565960164456635873292602800139946441631455089059333030019092502n,
                },
                {
                    x: 3388480662152145175635864255748126099235923984691173322316862026168741178388n,
                    y: 2003030660251359253503157483110391092503889356140918420205687521672316762482n,
                },
            ],
        }

        const inputs: FixedArray<bigint, 1> = [113569n]

        const result = g16bn256test.verify((self) => {
            self.verifyProof(inputs, proof, vk)
        })
        expect(result.success, result.error).to.be.true
    })
})
