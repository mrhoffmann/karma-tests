/*
The interface allows us to make our functions more predictable so that we can assume input and output
*/

export interface Course {
	//<field>?: meaning that the named field is optional
	name: string; //string, any sequence of characters, symbols or digits
	description: string; //--
	topicId: number; //number, any digit
}
