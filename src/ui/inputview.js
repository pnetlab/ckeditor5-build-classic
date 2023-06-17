import View from '@ckeditor/ckeditor5-ui/src/view';

export default class InputView extends View {
    constructor( locale, options={} ) {
        super( locale );

        // An entry point to binding observables with DOM attributes,
        // events and text nodes.
        const bind = this.bindTemplate;

        // Views define their interface (state) using observable properties.
        this.set( {
            isEnabled: true,
            placeholder: options.placeholder,
            change: options.change,
        } );

        this.setTemplate( {
            tag: 'input',
            attributes: {

                // The HTML "placeholder" attribute is also controlled by the observable.
                placeholder: bind.to( 'placeholder' ),
                type: 'number',
                style: {
                	border: 'solid thin darkgray',
                	borderRadius: '4px',
                	margin: '3px',
                	padding: '3px', 
                }
            },
            on: {
                // DOM keydown events will fire the view#input event.
                change: bind.to(()=>{this.change(this.element.value)})
            }
        } );
    }
    
    setValue( newValue ) {
        this.element.value = newValue;
    }
   
}