import { closeAuction } from '../middlewares/closeAuction';
import { getEndedAuctions } from '../middlewares/getEndedAuctions';

async function processAuctions(event, context) {
    try {
      const auctionsToClose = await getEndedAuctions();
      const closePromises = auctionsToClose.map(auction => closeAuction(auction));
      await Promise.all(closePromises);
      return { closed: closePromises.length };
    } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  }
  
  export const handler = processAuctions;