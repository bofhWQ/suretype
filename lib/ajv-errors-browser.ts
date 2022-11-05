import {setPrettify} from "./ajv-errors"
import {getSuretypeOptions, setSuretypeOptions} from "./options"
import {prettify} from "awesome-ajv-errors";
import {styledPrettify} from "awesome-ajv-errors/dist/index-try-styled";

setPrettify( prettify );
styledPrettify
	.then( prettify =>
	{
		setPrettify( prettify );

		// Coerce stylings to true (unless already configured by the user)
		const opts = getSuretypeOptions( );
		opts.colors = opts.colors ?? true;
		opts.location = opts.location ?? true;
		opts.bigNumbers = opts.bigNumbers ?? true;
		setSuretypeOptions( opts );
	} );
