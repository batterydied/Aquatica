export class ProfileService {
    constructor() {
        this.curSellId = null;
        this.curSellData = {};
    }

    retrieveSellerData() { // eventually will call server
        this.curSellData = {id: this.curSellId};
        return this.curSellData;
    }

    static getInstance() {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService;
        }
        return ProfileService.instance;
    }
}