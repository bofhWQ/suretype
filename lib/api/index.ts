import { BaseValidator } from "../validators/base/validator"
import { BooleanValidator } from "../validators/boolean/validator"
import { NumberValidator } from "../validators/number/validator"
import { StringValidator } from "../validators/string/validator"
import { NullValidator } from "../validators/null/validator"
import { AnyValidator } from "../validators/any/validator"
import { ObjectValidator } from "../validators/object/validator"
import { ArrayValidator } from "../validators/array/validator"
import { TupleValidator } from "../validators/tuple/validator"
import { AnyOfValidator } from "../validators/or/validator"
import { AllOfValidator } from "../validators/all-of/validator"
import { IfValidator } from "../validators/if/validator"
import { TypeOf } from "../validators/functional"
import {
	cloneValidator,
	decorateValidator,
	getDecorations,
} from "../validation"
import { ArrayFunction, TupleFunction } from "../validators/array-types"
import { ExtractObject } from "../validators/object-types"
import { DecorationsHolder, Decorations } from "../validators/decorations"


const string = ( ) => new StringValidator( );

const number = ( ) => new NumberValidator( );

const object =
	< T extends { [ key: string ]: BaseValidator< unknown >; } >( obj: T ) =>
		new ObjectValidator< ExtractObject< T > >( obj );

const tuple: TupleFunction =
	< U extends BaseValidator< unknown >[ ] >( types: U ) =>
		new TupleValidator< any, any, any, any >( types );

const array: ArrayFunction =
	< U extends BaseValidator< unknown > >( itemType?: U ) =>
		new ArrayValidator< Array< TypeOf< U > > >( itemType ?? any( ) );

const arrayOrTuple = (
	< T >( itemType?: T ) =>
		typeof itemType === 'object' && itemType && Array.isArray( itemType )
		? tuple( itemType as any )
		: array( itemType as any )
	) as ArrayFunction & TupleFunction;

const boolean = ( ) => new BooleanValidator( );

const _null = ( ) => new NullValidator( );

const anyOf =
	< T extends BaseValidator< unknown > >( validators: ReadonlyArray< T > ) =>
	new AnyOfValidator< TypeOf< T > >( validators );

const allOf =
	< T extends BaseValidator< unknown > >( validators: ReadonlyArray< T > ) =>
	new AllOfValidator< TypeOf< T > >( validators );

const any = ( ) => new AnyValidator( );

const _if = < T extends BaseValidator< unknown > >( validator: T ) =>
	new IfValidator< TypeOf< T > >( validator );

export const v = {
	string,
	number,
	object,
	array: arrayOrTuple,
	boolean,
	null: _null,
	anyOf,
	allOf,
	if: _if,
	any,
};

/**
 * Decorate a validator with a name and other annotations
 *
 * @param decorations Decorations
 * @param validator Target validator to decorate
 * @returns Decorated validator
 */
export function suretype< T extends BaseValidator< unknown, any > >(
	decorations: Decorations,
	validator: T
)
: T
{
	return decorateValidator(
		cloneValidator( validator, false ),
		new DecorationsHolder( decorations )
	);
}

/**
 * Ensures a validator is decorated with a name. This will not overwrite the
 * name of a validator, only ensure it has one.
 *
 * @param name The name to decorate with, unless already decorated
 * @param validator The target validator
 * @returns Decorated validator
 */
export function ensureNamed< T extends BaseValidator< unknown, any > >(
	name: string,
	validator: T
)
: T
{
	if ( getDecorations( validator )?.options.name )
		return validator;

	return decorateValidator(
		cloneValidator( validator, false ),
		new DecorationsHolder( { name } )
	);
}
