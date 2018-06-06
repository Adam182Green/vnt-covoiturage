export class Account {

	email: string;
	password: string;
	firstName: string;
	surname: string;

	constructor(public _email: string, public _password: string, public _firstName: string, public _surname: string){
		this.email = _email;
		this.password = _password;
		this.firstName = _firstName;
		this.surname = _surname;
	}
}