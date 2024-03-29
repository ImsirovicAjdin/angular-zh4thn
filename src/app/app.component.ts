import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
}
/*
Building Nested Components
################################

There are 2 ways to use a component and display a component's template. We can use a component as a directive:
<body>
  <pm-root></pm-root>
</body>

Alternatively, we can use a component as a routing target, so that it appears to the user that they've travelled to another view.

The template is then displayed in a full-page style view.

What makes a component nestable?

- Its template only manages a fragment of a larger view
- It has a selector
- It optionally communicates with its container

We'll cover:
- Using a Nested Component
- Passing Data to a nested component using @Input
- Raising an event from a nested component using @output



Building a Nested Component
###########################
Here is a visual representation of a component that is nestable. Here is another component. It wants to use the nestable component in its template. We then refer to the outer component as the container or parent component, and we refer to the inner component as the nested, or child component. When building an interactive application, the nested component often needs to communicate with its container. The nested component receives information from its container using input properties, and the nested component outputs information back to its container by raising events. In our sample application, we want to change the display of the 5 Star Rating from this, to this. Displaying the rating number using a visual representation such as stars makes it quicker and easier for the user to interpret the meaning of the number. This is the nested component we'll build in this module. For the star component to display the correct number of stars, the container must provide the rating number to our star component as an input. And if the user clicks on the stars, we want to raise an event to notify the container. Let's jump right in and build our star component. When we last saw our sample application, we had completed the product list component. Now of course, we want to change it. Instead of displaying a number for the rating here, we want to display stars. Instead of adding a code to the product list component to display the stars, we want to build it as a separate component. This keeps the template and logic for that feature encapsulated and makes it reusable. So let's begin by creating a star component. The star component can be used by any feature of the application, so it really doesn't belong in our products folder. We'll instead put it in a shared folder where we'll put all our shared components. If you are using the starter files, I've already created this folder and included the template and style sheet for our component here. Now we are ready to build the star component. We begin by creating a new file. We'll name it star. component. ts. We then create this component just like we'd create any other component, starting with the class, export class StarComponent. What's next? Yep, we decorate the class with the Component decorator. Recall that it is this Component decorator that makes this class a component. As always, it shows us a syntax error here because we are missing, yep, our import. Time to set the Component decorator properties. For the selector, we'll set pm-star. For the templateUrl, we provide the path to the HTML file provided with the starter files. We'll add the styleUrls property, and in the array we'll set the first element to the path of the style sheet that was also provided. Since both files are in the same folder as the component, we can use relative pathing. Now let's take a peek at the star component template. Here it displays five stars. It then crops the stars based on a defined width. This technique can then display partial stars, such as four and a half of the five stars by setting the width such that only four and a half of the stars appear. Recall what this syntax is called? This is property binding. We're using it here to set the style width and here to bind the title property to display the numeric rating value. For these bindings to work, we need two properties in the components class, the rating and the starWidth. Let's add these two properties. We want a rating property, which is a number and defines the rating value. Since we don't yet have a way to get this value, let's hardcode it to 4 for now so we'll see some stars. And we need the starWidth. This value is calculated based on the rating. So where do we put that calculation? Well, we'd want the starWidth recalculated any time the container changed the rating number. So let's tap into the OnChanges lifecycle hook as we discussed in the last module. We'll implement the OnChanges interface, and we'll write code for the ngOnChanges method identified in the OnChanges interface. In this method, we'll convert the rating number to a starWidth based on the width of our stars. Our component is now complete, and we're ready to nest it in another component. How do we do that?

// star.component.ts:
import { Component } from '@angular/core';

@Component({
  selector: 'pm-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnChanges {
  rating: number =4;
  starWidth: number;

  ngOnChanges(): void {
    this.starWidth = this.rating * 75 / 5;
  }
}

// star.component.html:
<div class="crop"
  [style.width.px]="starWidth"
  [title]="rating">
<div style="width: 75px">
  <span class="fa fa-star"></span>
  <span class="fa fa-star"></span>
  <span class="fa fa-star"></span>
  <span class="fa fa-star"></span>
</div>
</div>

Using a Nested Component as a directive
##########################################
Easy, just use <app-selector><app-selector> directive instead of {{ interpolation }}

Passing Data to a Nested Component (@Input)
###########################################

// shortened files:

product-list.component.ts:
-------------------------
@Component({
  selector: 'pm-products',
  templateURL: './product-list.component.html'
})
export class ProductListComponent { }

product-list.component.html:
---------------------------
<td>
  <pm-star [rating]='product.starRating'> <!------------ (2) 
  </pm-star>
</td>

star.component.ts
-----------------
@Component({
  selector: 'pm-star',
  templateURL: './star.component.html'
})
export class StarComponent {
  @Input() rating: number; <------------ (1)
  starWidth: number;
}

explanation theirs:
In the containers template, we use property binding and define the nested component's input property as the target of the binding, then we set the binding source to the value we want to pass into the nested component. In this example, we pass the product's star rating. That's it. The product.starRating property is now bound to the rating input property of the nested component. Any time the container data changes, the OnChanges lifecycle event is generated and the star width is recalculated. The appropriate number of stars are then displayed. Let's check it out in the browser. That looks better. But what if we want to send data back from our nested component to our container? Let's look at that next.

explanation mine:
The @Input() rating property from the nested component is bound to the root component, in the location where it calls the directive of the nested component: <pm-star [rating]="product.starRating">. As before, this is a one-way data binding of the [property] binding kind. We set the binding source as the value we want to pass in to the nested component. From class to template, we pass the product's star rating. The product's starRating property is now bound to the rating input property of the nested component. Any time the container data changes, the OnChanges lifecycle event is generated and the star width is recalculated. 

Passing Data from a component using @Output
###########################################

The only way a nested component can pass data back to its root component is with an event. The data to pass becomes the event payload. In Angular, an event is defined with an EventEmitter object. So here we create a new instance of an event emitter:

@Output() notify: EventEmitter<string> = new EventEmitter<string>();
                  ^^^^^^^^^^^^^^^^^^^^

^^^^^ = TypeScript supports generics. This syntax allows us to identify a specific type that the object instance will work with. When creating an event emitter, the generic argument <string> identifies the type of the event payload. If we want to pass a string value to the container in the event payload, we define a string here. In our example, we define a ******notify******* event with a string payload. 

When the user clicks on the stars, the star component receives that event:
<div (click)='onClick()'>
  ... stars...
</div>

Raising an event:
https://imgur.com/PgP1Ah9

Continue at 08-05 (2:48)






*/
