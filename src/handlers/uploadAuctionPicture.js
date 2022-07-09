import { setAuctionPictureUrl } from "../helpers/setAuctionPictureUrl";
import { uploadPictureToS3 }  from "../helpers/uploadPictureToS3";
import { getAuctionById } from "./getAuction";

export async function uploadAuctionPicture(event) {
    const { id } = event.pathParameters;
    const { email } = event.requestContext.authorizer;
    const auction = await getAuctionById(id);

     // Validate auction ownership
    if (auction.seller !== email) {
      
        throw new createError.Forbidden(`You are not the seller of this auction!`);
    }

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    
    try {
        const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
        const updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl.Location);

        return {
            statusCode: 200,
            body: JSON.stringify(updatedAuction),
        };
        
      } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
      }
    

  
   
  }
  
  export const handler = uploadAuctionPicture;