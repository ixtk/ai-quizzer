import "../App.css"
function HomePage() {
  return (
    <div className="container">
      <h1>Home</h1>

      <div className="card">
        <button className="btn btn-primary">Click Me</button>
        <button className="btn btn-outline">Click Me</button>
        <button className="btn btn-secondary">Click Me</button>
      </div>

      <br />

      <div className="card">
        <div>
          <label htmlFor="username">Username</label> 
          <input type="text" id="username" />
        </div>

        <br />

        <div>
          <label htmlFor="story">Story</label>
          <textarea rows={5} id="story"></textarea>
        </div>
      </div>

      <br />

      <span className="badge badge-danger">TRUE</span>
      <span className="badge badge-success">FALSE</span>
    </div>
  )
}
export default HomePage
