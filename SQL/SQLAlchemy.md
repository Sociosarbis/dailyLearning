* ### Format of uri to connect to database
  `dialect[+driver]://user:password@host/dbname[?key=value..]`
  
  e.g.`mysql+pymysql://root:Mysql_music71016@localhost/new_words`
  
  **pymysql** shown above is a library of mysql driver.
* ### Declaring table needs to extends *sqlalchemy.ext.declarative.declarative_base*
```python
Base = declarative_base()
class User(Base):
  __tablename__ = 'users'

  id = Column(Integer, primary_key=True)
  name = Column(String)
  fullname = Column(String)
  nickname = Column(String)

  def __repr__(self):
    return "<User(name='%s', fullname='%s', nickname='%s')>" % (
                         self.name, self.fullname, self.nickname)
```

* ### Commonly used options in column declaration.
  * primary_key: Boolean
  * nullable: Boolean
  * unique: Boolean
  * autoincrement: Boolean
  * additional positional arguements in Column constructor
    * ForeignKey
      * Format of ForeignKey name: `$table_name.$column_name`
  
* ### Interacting with internal database needs session creation.
  * Session Factory: sqlalchemy.orm.sessionmaker.Note that Session needs to bind an engine. 
    ```python
    Session = sessionmaker(bind=engine) #bind an engine when to construct Session Class
    # or after constructed Session Class with Session.configure
    Session.configure(bind=engine)
    session = Session()
    ```
* CURD
  * Add new object.
  ```python
  ed_user = User(name='ed', fullname='Ed Jones', nickname='edsnickname')
  session.add(ed_user)
  # add objects in a batch.
  ```python
  session.add_all([
    User(name='wendy', fullname='Wendy Williams', nickname='windy'),
    User(name='mary', fullname='Mary Contrary', nickname='mary'),
    User(name='fred', fullname='Fred Flintstone', nickname='freddy')])
  ```
  * if an object has been done adding operation, the object will be added to **session.new**-an IdentitySet. 
  * query for objects.
  ```python
  our_user = session.query(User).filter_by(name='ed').first()
  ```
    * Note that query(User) does not means **searching in table user**, but **select all properties of any row in table user**.
  * update properties of object.
    ```python
    ed_user.nickname = 'eddie'
    ```
    * if an object has been done updation operation, the object will be added to `session.dirty`-an IdentitySet like `session.new`. 
  * delete object.
    ```python
    session.delete(jack)
    ```
  * issue the changes to the internal database with `session.commit()`
* Add Relationship between tables.
  * relationship is not built on database level.Instead, the logics are running on the ORM system.
  * declare a relationship like column.
  ```python
  user = relationship("User")
  """
  if the other table holds a foreign key of this table, relationship property defaults to None.
  If the condition is reversed, defaults to a empty list-[].
  """
  # if the other side also needs a reference to this table, the code above should be rewritten as:
  user = relationship("User", back_populates="addresses")
  # the other side also need to declare the relationship as:
  addresses = relationship("Address", back_populates="user")
  # or only declare once with:
  user = relationship("User", back_ref="addresses") # back_ref can be considered as the shortcut of back_populates.
  ```
