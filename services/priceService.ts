import { Price } from "@/shared/types/price";
import axios from "axios";

class PriceService {
  priceUrl = "https://interview.switcheo.com/prices.json";
  async getPrices(): Promise<Array<Price>> {
    const response = await axios.get<Array<Price>>(this.priceUrl);
    return response.data;
  }
}

export default new PriceService();
