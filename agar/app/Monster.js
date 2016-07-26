const MONSTER_TYPE = {
    MELEE: 0,
    RANGED: 1,
    MAGIC: 2
};

class MonsterAttributes {
    constructor(hp = 100, mp = 0, def = 5, mDef = 5, atkSpeed = 1, mSpeed = 2) {
        this.hp = hp;
        this.mp = mp;
        this.def = def;
        this.mDef = mDef;
        this.atkSpeed = atkSpeed;
        this.mSpeed = mSpeed;
        this.type = [];
    }
}

class Monster {
    constructor(spanPoint, attrs = new MonsterAttributes()) {
        this.attrs = attrs;
        this._spawn(spanPoint);
    }

    _spawn(spanPoint) {
        this.x = spanPoint.x;
        this.y = spanPoint.y;
    }

    addType(type) {
        this.type.push(type);
    }

    attack(target) {

    }

    move(target) {

    }
}