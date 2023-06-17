/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import widgetFactory from '../ckeditor_magicwidget/widgetFactory';
import widgetRegister from '../ckeditor_magicwidget/widgetRegister';
import React, { Component } from 'react'
import ImageLink from './ui/ImageLink';




/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageResize extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageResize';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		//const command = new TableResizeCommand( editor );

		this._registerSchema();
		this._registerConverters();

		widgetRegister(this.editor, 'image');

		//editor.commands.add( 'TableResize', command );

		//		editor.editing.downcastDispatcher.on( 'insert:table', ( evt, data, conversionApi ) => {
		//			const widget = conversionApi.mapper.toViewElement( data.item );
		//			const resizer = editor.plugins
		//				.get( WidgetResize )
		//				.attachTo( {
		//					unit: '%',
		//					modelElement: data.item,
		//					viewElement: widget,
		//					downcastWriter: conversionApi.writer,
		//					getHandleHost( domWidgetElement ) {
		//						return domWidgetElement;
		//					},
		//					getResizeHost( domWidgetElement ) {
		//						return domWidgetElement;
		//					},
		//					// TODO consider other positions.
		//					onCommit( newValue ){
		//						const tableElement = editor.model.document.selection.getSelectedElement();
		//						editor.model.change( writer => {
		//							writer.setAttribute( 'width', newValue, tableElement);
		//						} );
		//					}
		//
		//				} );
		//
		//		}, { priority: 'low' } );

		this.editor.editing.view.document.on('keydown', (event, dom)=>{
			var evt = dom.domEvent;
			if(evt.code == 'ArrowRight'){
				var selectElement = editor.model.document.selection.getSelectedElement();
				
				if(!selectElement) return;
				if(selectElement.name != 'image') return;
				if(selectElement.parent.getChildIndex(selectElement) < selectElement.parent.childCount - 1) return;
				
				this.editor.model.change(writer => {
					var start = writer.createPositionAfter(selectElement);
					writer.insertElement( 'paragraph', start);
				});
			}
		}, {priority:100000});

	}


	_registerSchema() {

		this.editor.model.schema.extend('image', {
			allowContentOf: '$root',
			allowAttributes:['link', 'target'],
			defaults: { width: '', wunit: '%', height: '', hunit: 'px' },
			isLimit: true,
			isObject: true,
			isBlock: true,
		});

		this.editor.model.schema.register('imageCaption', {
			allowWhere: '$block',
			allowAttributes: ['display'],
			allowContentOf: '$root',
		});
	}


	_registerConverters() {

		this.editor.conversion.for('editingDowncast').add(dispatcher =>

			dispatcher.on('insert:image', (evt, data, conversionApi) => {

				this.editor.editing.view.change(writer => {
					var table = conversionApi.mapper.toViewElement(data.item);
					var widgetFac = new widgetFactory(this.editor);
					widgetFac.make(writer, data.item, table, {
						resize: 'horizontal',
						buttons: [
							this.editor.ui.componentFactory.create('imageStyle:alignLeft'),
							this.editor.ui.componentFactory.create('imageStyle:full'),
							this.editor.ui.componentFactory.create('imageStyle:alignRight'),
						],
						toolbar: <div style={{display:'flex', alignItems:'center'}}>
							<i style={{margin:'0px 2px'}} className="ck ck-button fa fa-font" onClick={()=>{
								var selection = this.editor.model.document.selection.getSelectedElement();
								if(!selection) return;
								var caption = findFirstChild(selection, item=>item.name == 'imageCaption');
								if(!caption){
									this.editor.editing.model.change(writer => {
										const imageCaption = writer.createElement('imageCaption', {display:'block'});
										writer.insertElement( 'paragraph',{marginTop:'1rem', marginBottom:0}, imageCaption);
										writer.insert(imageCaption, selection);
									})
								}else{
									this.editor.editing.model.change(writer => {
										var display = caption.getAttribute('display');
										if(display == 'none'){
											writer.setAttribute('display', 'block', caption);
										}else{
											writer.setAttribute('display', 'none', caption);
										}
										
									})
								}

							}}></i>
							
							<ImageLink ref={comp => this.imageLink = comp} onSave={(data)=>{
								if(!data.link) data.link = '';
								if(!data.target) data.target = '';
								this.editor.editing.model.change(writer => {
									var selection = this.editor.model.document.selection.getSelectedElement();
									if(!selection) return;
									if(selection.name == 'image'){
										writer.setAttributes(data, selection);
									}
								})
							}}></ImageLink>
						
						</div>,

						onSelect: (me, ve)=>{
							this.imageLink.setValue({
								link: me.getAttribute('link'),
								target: me.getAttribute('target')
							});
						}
						

					})

				});


			})
		)

		//		this.editor.model.document.selection.on('change:range',(event)=>{
		//			var parentModel = event.source.getFirstPosition().parent;
		//			if(parentModel.name == 'image'){
		//				this.editor.model.change(writer=>{
		//					writer.setSelection( parentModel, 'on' );
		//				})
		//			}
		//		})




		// Dedicated converter to propagate table's attribute to the img tag.
		// this.editor.conversion.for('dataDowncast').elementToElement({
		// 	model: 'imageCaption',
		// 	view: (modelElement, viewWriter) => {
		// 		return viewWriter.createContainerElement('div', { class: 'image_caption' })
		// 	}
		// });

		this.editor.conversion.for('upcast').elementToElement({
			view: {
				name: 'div',
				classes: 'image_caption'
			},
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('imageCaption');
			}
		});

		// this.editor.conversion.for( 'editingDowncast' )
		// 	.attributeToElement( { 
		// 		model: {
		// 			name:'image',
		// 			key:'linkHref', 
		// 		},
		// 		view: ( href, writer ) => {
		// 		console.log('tst');
		// 		var element = writer.createAttributeElement( 'a', {href:href});
		// 		return element;
		// 	} } );

		// this.editor.conversion.for('editingDowncast').elementToElement({
		// 	model: 'imageCaption',
		// 	view: (modelElement, viewWriter) => {
		// 		// Note: You use a more specialized createEditableElement() method here.
		// 		const div = viewWriter.createEditableElement('div', {class: 'image_caption', contenteditable:true});
		// 		console.log('image_caption');
		// 		return div;
		// 	}
		// });

		this.editor.editing.downcastDispatcher.on('insert:imageCaption', ( evt, data, conversionApi )=>{
			const viewImage = conversionApi.mapper.toViewElement( data.range.start.parent );
			const viewPosition = conversionApi.writer.createPositionAt( viewImage, 'end' );
			const viewElement = conversionApi.writer.createEditableElement('div', {class: 'image_caption', contenteditable:true});
			conversionApi.mapper.bindElements( data.item, viewElement );
			conversionApi.writer.insert( viewPosition, viewElement );
		})

		this.editor.data.downcastDispatcher.on('insert:imageCaption', ( evt, data, conversionApi )=>{
			const viewImage = conversionApi.mapper.toViewElement( data.range.start.parent );
			const viewPosition = conversionApi.writer.createPositionAt( viewImage, 'end' );
			const viewElement = conversionApi.writer.createContainerElement('div', {class: 'image_caption', contenteditable:true});
			conversionApi.mapper.bindElements( data.item, viewElement );
			conversionApi.writer.insert( viewPosition, viewElement );
		})


		this.editor.conversion.for( 'downcast' ).add( dispatcher =>
			dispatcher.on( 'attribute:display:imageCaption', ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				
				if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
					viewWriter.setStyle( 'display', data.attributeNewValue, viewElement );
				} else {
					viewWriter.removeStyle( 'display', viewElement );
				}
			} )
		);

		this.editor.conversion.for( 'upcast' )
			.attributeToAttribute( {
				view: {
					name: 'imageCaption',
					styles: {
						'display':/.+/
					}
				},
				model: {
					key: 'display',
					value: viewElement => viewElement.getStyle( 'display' )
				}
			} )
			;


		this.editor.conversion.for( 'downcast' ).add(this.downcastImageLink());
		this.editor.data.upcastDispatcher.on( 'element:a', ( evt, data, conversionApi ) => {
			
			if ( !data.modelRange ) {
				// Convert children and set conversion result as a current data.
				data = Object.assign( data, conversionApi.convertChildren( data.viewItem, data.modelCursor ));
			}
	
			for ( let item of data.modelRange.getItems() ) {
				if ( conversionApi.schema.checkAttribute( item, 'link' ) ) {
					conversionApi.writer.setAttribute( 'link', data.viewItem.getAttribute( 'href' ), item );
				}
				if ( conversionApi.schema.checkAttribute( item, 'target' ) ) {
					conversionApi.writer.setAttribute( 'target', data.viewItem.getAttribute( 'target' ), item );
				}
			}
			
		});


	}


	downcastImageLink() {
		return dispatcher => {
		  dispatcher.on( 'attribute:link:image', ( evt, data, conversionApi ) => {
			
			const writer = conversionApi.writer;
			const href = data.attributeNewValue;
			var target = data.item.getAttribute('target');
			if(!target) target = '';
			if(href != ''){
				// The image will be already converted - so it will be present in the view.
				const viewImage = conversionApi.mapper.toViewElement( data.item );
		
				// Below will wrap already converted image by newly created link element.
		
				// 1. Create empty link element.
				const linkElement = conversionApi.writer.createContainerElement( 'a', { href, target } );
		
				// 2. Insert link before associated image.
				
				conversionApi.writer.insert( writer.createPositionBefore(viewImage), linkElement );
		
				// 3. Move whole converted image to a link.
				
				conversionApi.writer.move( writer.createRangeOn( viewImage ), writer.createPositionAt( linkElement, 0 ) );
			}else{
				const viewImage = conversionApi.mapper.toViewElement( data.item );
				const link = viewImage.parent;
				if(link.name == 'a'){
					conversionApi.writer.move( writer.createRangeOn( viewImage ), writer.createPositionAfter(viewImage.parent));
					conversionApi.writer.remove(link);
				}
			}
			
		  }, { priority: 'normal' } );
		};
	  }
}

