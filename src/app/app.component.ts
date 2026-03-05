import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';



@Component({

  selector: 'app-root',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './app.component.html',

  styleUrl: './app.component.css'

})

export class AppComponent implements OnInit {

  readonly APIUrl = "http://localhost:5038/api/books/";

  books: any = [];



  id: string = "";

  titleProp: string = "";

  author: string = "";

  year: string = "";

  category: string = "";

  price: number = 0;

  desc: string = "";

  imageAddress: string = "";



  isEdit: boolean = false;

  isDarkMode: boolean = false;



  constructor(private http: HttpClient) {}



  ngOnInit() {

    this.refreshBooks();

    if (localStorage.getItem('theme') === 'dark') this.toggleTheme();

  }



  toggleTheme() {

    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {

      document.body.classList.add('dark-theme');

      localStorage.setItem('theme', 'dark');

    } else {

      document.body.classList.remove('dark-theme');

      localStorage.setItem('theme', 'light');

    }

  }



  refreshBooks() {

    this.http.get(this.APIUrl + 'GetBooks').subscribe(data => this.books = data);

  }



  saveBook() {

    const formData = new FormData();

    formData.append("title", this.titleProp);

    formData.append("author", this.author);

    formData.append("year", this.year);

    formData.append("category", this.category);

    formData.append("price", this.price.toString());

    formData.append("description", this.desc);

    formData.append("imageAddress", this.imageAddress);



    if (!this.isEdit) {

      this.http.post(this.APIUrl + 'AddBook', formData).subscribe(() => {

        this.resetForm();

        this.refreshBooks();

      });

    } else {

      formData.append("id", this.id);

      this.http.put(this.APIUrl + 'UpdateBook', formData).subscribe(() => {

        this.resetForm();

        this.refreshBooks();

      });

    }

  }



  editBook(book: any) {

    this.isEdit = true;

    this.id = book.id;

    this.titleProp = book.title;

    this.author = book.author;

    this.year = book.year;

    this.category = book.category;

    this.price = book.price;

    this.desc = book.desc;

    this.imageAddress = book.imageAddress;

    window.scrollTo({ top: 0, behavior: 'smooth' });

  }



  deleteBook(id: any) {

    if(confirm("Are you sure?")) {

      this.http.delete(this.APIUrl + 'DeleteBook?id=' + id).subscribe(() => this.refreshBooks());
    }
  }
  resetForm() {
    this.isEdit = false;
    this.id = ""; this.titleProp = ""; this.author = "";
    this.year = ""; this.category = ""; this.price = 0;
    this.desc = ""; this.imageAddress = "";
  }
}
