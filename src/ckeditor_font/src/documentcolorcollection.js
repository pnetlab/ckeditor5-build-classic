import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

/**
 * @module font/documentcolorcollection
 */

/**
 * A collection to store document colors. It enforces colors to be unique.
 *
 * @mixes module:utils/observablemixin~ObservableMixin
 * @extends module:utils/collection~Collection
 */
export default class DocumentColorCollection extends Collection {
	constructor( options ) {
		super( options );

		/**
		 * Indicates whether the document color collection is empty.
		 *
		 * @observable
		 * @readonly
		 * @member {Boolean} #isEmpty
		 */
		this.set( 'isEmpty', true );
	}

	/**
	 * Adds a color to the document color collection.
	 *
	 * This method ensures that no color duplicates are inserted (compared using
	 * the color value of the {@link module:ui/colorgrid/colorgrid~ColorDefinition}).
	 *
	 * If the item does not have an ID, it will be automatically generated and set on the item.
	 *
	 * @chainable
	 * @param {module:ui/colorgrid/colorgrid~ColorDefinition} item
	 * @param {Number} [index] The position of the item in the collection. The item
	 * is pushed to the collection when `index` is not specified.
	 * @fires add
	 */
	add( item, index ) {
		if ( this.find( element => element.color === item.color ) ) {
			// No duplicates are allowed.
			return;
		}

		super.add( item, index );

		this.set( 'isEmpty', false );
	}

	/**
	 * @inheritdoc
	 */
	remove( subject ) {
		const ret = super.remove( subject );

		if ( this.length === 0 ) {
			this.set( 'isEmpty', true );
		}

		return ret;
	}

	/**
	 * Checks if an object with given colors is present in the document color collection.
	 *
	 * @param {String} color
	 * @returns {Boolean}
	 */
	hasColor( color ) {
		return !!this.find( item => item.color === color );
	}
}

mix( DocumentColorCollection, ObservableMixin );
