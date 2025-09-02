from flask import Flask, render_template, request, redirect, Response
import sqlite3
from utils import calculate_cost

app = Flask(__name__)
DB_PATH = 'database/food.db'

# สร้างตารางถ้ายังไม่มี
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            unit TEXT,
            price_per_unit REAL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS menu_ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            menu_id INTEGER,
            ingredient_id INTEGER,
            quantity REAL,
            FOREIGN KEY(menu_id) REFERENCES menu(id),
            FOREIGN KEY(ingredient_id) REFERENCES ingredients(id)
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('SELECT * FROM menu')
    menus_raw = c.fetchall()

    menus = []
    for menu in menus_raw:
        cost = calculate_cost(menu[0])
        c.execute('''
            SELECT i.id, i.name, i.unit, mi.quantity, i.price_per_unit
            FROM menu_ingredients mi
            JOIN ingredients i ON mi.ingredient_id = i.id
            WHERE mi.menu_id = ?
        ''', (menu[0],))
        ingredients = c.fetchall()

        menus.append({
            'id': menu[0],
            'name': menu[1],
            'price': menu[2],
            'cost': cost,
            'ingredients': ingredients
        })

    c.execute('SELECT * FROM ingredients')
    all_ingredients = c.fetchall()

    conn.close()
    return render_template('index.html', menus=menus, ingredients=all_ingredients)

@app.route('/add_menu', methods=['POST'])
def add_menu():
    name = request.form['name']
    price = float(request.form['price'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO menu (name, price) VALUES (?, ?)', (name, price))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/add_ingredient', methods=['POST'])
def add_ingredient():
    name = request.form['name']
    unit = request.form['unit']
    price = float(request.form['price'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO ingredients (name, unit, price_per_unit) VALUES (?, ?, ?)', (name, unit, price))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/assign_ingredient', methods=['POST'])
def assign_ingredient():
    menu_id = int(request.form['menu_id'])
    ingredient_id = int(request.form['ingredient_id'])
    quantity = float(request.form['quantity'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO menu_ingredients (menu_id, ingredient_id, quantity) VALUES (?, ?, ?)',
              (menu_id, ingredient_id, quantity))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/update_quantity', methods=['POST'])
def update_quantity():
    menu_id = int(request.form['menu_id'])
    ingredient_id = int(request.form['ingredient_id'])
    new_quantity = float(request.form['new_quantity'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE menu_ingredients SET quantity = ? WHERE menu_id = ? AND ingredient_id = ?',
              (new_quantity, menu_id, ingredient_id))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/remove_ingredient', methods=['POST'])
def remove_ingredient():
    menu_id = int(request.form['menu_id'])
    ingredient_id = int(request.form['ingredient_id'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM menu_ingredients WHERE menu_id = ? AND ingredient_id = ?',
              (menu_id, ingredient_id))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/delete_menu', methods=['POST'])
def delete_menu():
    menu_id = int(request.form['menu_id'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM menu_ingredients WHERE menu_id = ?', (menu_id,))
    c.execute('DELETE FROM menu WHERE id = ?', (menu_id,))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/delete_ingredient', methods=['POST'])
def delete_ingredient():
    ingredient_id = int(request.form['ingredient_id'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM menu_ingredients WHERE ingredient_id = ?', (ingredient_id,))
    c.execute('DELETE FROM ingredients WHERE id = ?', (ingredient_id,))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/edit_menu', methods=['POST'])
def edit_menu():
    menu_id = int(request.form['menu_id'])
    new_name = request.form['new_name']
    new_price = float(request.form['new_price'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE menu SET name = ?, price = ? WHERE id = ?', (new_name, new_price, menu_id))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/edit_ingredient', methods=['POST'])
def edit_ingredient():
    ingredient_id = int(request.form['ingredient_id'])
    new_name = request.form['new_name']
    new_unit = request.form['new_unit']
    new_price = float(request.form['new_price'])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE ingredients SET name = ?, unit = ?, price_per_unit = ? WHERE id = ?',
              (new_name, new_unit, new_price, ingredient_id))
    conn.commit()
    conn.close()
    return redirect('/')

@app.route('/export_csv')
def export_csv():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM menu')
    menus = c.fetchall()

    output = []
    output.append(['ชื่อเมนู', 'ราคาขาย', 'ต้นทุน', 'กำไร'])

    for menu in menus:
        cost = calculate_cost(menu[0])
        profit = round(menu[2] - cost, 2)
        output.append([menu[1], menu[2], cost, profit])

    conn.close()

    def generate():
        for row in output:
            yield ','.join(map(str, row)) + '\n'

    return Response(generate(), mimetype='text/csv',
                    headers={"Content-Disposition": "attachment;filename=menu_costs.csv"})

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)



from flask import send_from_directory

@app.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')

@app.route('/service-worker.js')
def service_worker():
    return send_from_directory('static', 'service-worker.js')
