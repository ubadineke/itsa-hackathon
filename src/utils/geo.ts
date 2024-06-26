//get long. and lat. for a technician
import axios from 'axios';
import Config from '../config';

const technician = {
    state: 'Akwa Ibom',
    lga: 'Etinan',
};

export default class Geo {
    public static async getCoordinates(state: string, lga: string) {
        let arr = [];
        arr.push(lga.split(' '));
        arr.push(state.split(' '));

        arr = arr.flat();

        let text = '';

        for (let i = 0; i < arr.length; i++) {
            const str = `${arr[i]}%20`;
            text = text + str;
        }

        text = text + 'nigeria';

        const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${text}&format=json&apiKey=${Config.GEO_API_KEY}`
        );

        const result = response.data.results[0];
        const { lon, lat } = result;
        return [lon, lat];
    }
}
