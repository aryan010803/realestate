import Listing from "../modles/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async(req , res , next)=>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}
export const deleteLisiting = async(req , res , next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404 , 'not found'));
    }
    if(req.user.id!==listing.UserRef){
        return next(errorHandler(404 , 'you can only delete your own listing'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('deleted successfully ')
    } catch (error) {
        next(error)
    }
}
export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        
        if (req.user.id !== listing.UserRef.toString()) {
            return next(errorHandler(401, 'You can only update your own Listing'));
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedListing);
    } catch (error) {
        // Handle the error appropriately (send a response or log it)
        console.error(error);
        return next(errorHandler(500, 'Internal Server Error'));
    }
};

export const getListing = async(req  , res , next)=>{
    try {
        const listing= await Listing.findById(req.params.id)
        if(!listing){
            return next(errorHandler(404 ,'Listing not found '));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }

}