import View from '@ckeditor/ckeditor5-ui/src/view';

import React, { Component } from 'react'
import { render } from 'react-dom'

export default class ReactView extends View {
    constructor( locale, component ) {
        super( locale );

        // An entry point to binding observables with DOM attributes,
        // events and text nodes.
        const bind = this.bindTemplate;

        // Views define their interface (state) using observable properties.

        this.setTemplate({
            tag: 'div'
        });
        
        this.render();
        
        render(component, this.element);
        
    }
    
   
}