
import React, { Component } from 'react';


class Book extends Component {

  getBookColor(color) {
    const [r, g, b] = color;
    return `rgb(${r},${g},${b})`;
  }

  render() {
    const {name, description, rowColor} = this.props;
    return (
      <div className="book" >
          { /*style={ {backgroundColor: this.getBookColor(rowColor)} } */ }
          {`${name}: ${description}`}
      </div>
    );
  }
}

class BookshelfRow extends Component {

  getBooks(books, rowColor) {
    return books.map((book, index) =>
      <Book key={index} className="bookshelf-book"
            name={book.name} description={book.description}
            rowColor={rowColor} />
    );
  }

  render() {
    const name = this.props.name;
    const books = this.props.books;
    const rowColor = this.props.color;
    return (
      <div id={`row${name}`}>
        {this.getBooks(books, rowColor)}
      </div>
    );
  }
}

class Bookshelf extends Component {

    constructor(props) {
      super(props)
      this.state = {rows : [], titles : []}
    }

    componentDidMount() {
      fetch('http://localhost:4000/graphql',
        {
          method: 'POST',
          headers: { 'content-type': 'application/graphql' },
          body: `{
            row(name: "Science") {
              name
              color
              books {
                name
                description
              }
            }
            titles {
              text
            }
          }`
        }
      ).then(function(res) {
        res.json().then(function(data){
            this.setState({rows: data, titles: data});
        }.bind(this))
      }.bind(this)).then(function(json) {
          console.log(json);
      });
    }

  getRows(rows) {
    if (rows.data) {
      //console.log(rows.data.row);
      return rows.data.row.map((row, index) =>
        <BookshelfRow key={index} className="bookshelf-row" name={row.name} color={row.color} books={row.books}/>
      );
    }
  }

  getTitles(titles) {
    if (titles.data){
      return titles.data.titles.map((title, index) =>
        <tr>
          <td key={index}>{title.text}</td>
        </tr>
      );
    }
  }

  render() {
    const rows = this.state["rows"];
    const titles = this.state["titles"];
    return (
      <div>
        <div id="bookshelf" className="bookshelf">
          {this.getRows(rows)}
        </div>

        <div id="titles">
           <div className="col-lg-10">
             <div className="card">
               <div className="card-header">
                 <i className="fa fa-align-justify"></i> EDH Documents
               </div>
               <div className="card-block">
                 <table className="table table-striped">
                   <thead>
                     <tr>
                       <th>Titre du document</th>
                     </tr>
                   </thead>
                   <tbody>
                     {this.getTitles(titles)}
                   </tbody>
                 </table>
                 <ul className="pagination">
                   <li className="page-item"><a className="page-link" href="#">Prev</a></li>
                   <li className="page-item active">
                     <a className="page-link" href="#">1</a>
                   </li>
                   <li className="page-item"><a className="page-link" href="#">2</a></li>
                   <li className="page-item"><a className="page-link" href="#">3</a></li>
                   <li className="page-item"><a className="page-link" href="#">4</a></li>
                   <li className="page-item"><a className="page-link" href="#">Next</a></li>
                 </ul>
               </div>
             </div>
           </div>
        </div>
      </div>
    );
  }
}

export default Bookshelf;
