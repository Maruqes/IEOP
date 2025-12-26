import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGOCON)

const specsSchema = new Schema({
	id: String,
	specs: Schema.Types.Mixed,
}, {
	timestamps: true
});
const Specs = model('Specs', specsSchema);

export async function AddSpec(id, specs) {
	const res = await Specs.findOneAndUpdate(
		{ id: id },
		{ specs: specs },
		{ new: true, upsert: true }
	);
	return res;
}

export async function GetSpec(id) {
	const res = await Specs.findOne({
		id: id,
	});
	return res
}

export default Specs;
