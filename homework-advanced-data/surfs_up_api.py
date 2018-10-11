
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/start-date<br/>"
        f"/api/v1.0/start-date/end-date"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Calculate the date 1 year ago from today
    one_year = dt.date(2017,8,23) - dt.timedelta(365)
    # Perform a query to retrieve the date and precipitation
    results_prcp = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date >= one_year).all()
    # Create a dictionary from the row data and append to a list of precipitation for all dates
    all_prcp = []
    for row in results_prcp:
        prcp_dict = {}
        prcp_dict["date"] = row.date
        prcp_dict["prcp"] = row.prcp
        all_prcp.append(prcp_dict)
    # Jsonify the dictionary
    return jsonify(all_prcp)

@app.route("/api/v1.0/stations")
def station():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Perform a query to retrieve all stations from station table
    results_stations = session.query(Station.station, Station.name, Station.latitude, Station.longitude, Station.elevation).all()
    # Create a dictionary from the row data and append to a list of stations
    all_stations = []
    for row in results_stations:
        stations_dict = {}
        stations_dict["station"] = row.station
        stations_dict["name"] = row.name
        stations_dict["latitude"] = row.latitude
        stations_dict["longitude"] = row.longitude
        stations_dict["elevation"] = row.elevation
        all_stations.append(stations_dict)
    # Jsonify the dictionary
    return jsonify(all_stations)

@app.route("/api/v1.0/tobs")
def tobs():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Calculate the date 1 year ago from today
    one_year = dt.date(2017,8,23) - dt.timedelta(365)
    # Perform a query to retrieve the date and temperatures
    results_tobs = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date >= one_year).all()
    # Create a dictionary from the row data and append to a list of temperatures for all dates
    all_tobs = []
    for row in results_tobs:
        tobs_dict = {}
        tobs_dict["date"] = row.date
        tobs_dict["tobs"] = row.tobs
        all_tobs.append(tobs_dict)
    # Jsonify the dictionary
    return jsonify(all_tobs)

@app.route("/api/v1.0/<start>")
def tobs_start(start):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Perform a query to retrieve the min, max and averagetemperatures
    results_tobs_start = session.query(func.min(Measurement.tobs), func.max(Measurement.tobs), func.avg(Measurement.tobs)).filter(Measurement.date >= start).all()
    # Create a dictionary with the results from above calculations
    tobs_start_dict = {
        "min_temp": int(results_tobs_start[0][0]),
        "max_temp": int(results_tobs_start[0][1]),
        "avg_temp": int(results_tobs_start[0][2])
    }
    # Jsonify the dictionary
    return jsonify(tobs_start_dict)

@app.route("/api/v1.0/<start>/<end>")
def tobs_start_end(start,end):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Perform a query to retrieve the min, max and averagetemperatures
    results_tobs_start_end = session.query(func.min(Measurement.tobs), func.max(Measurement.tobs), func.avg(Measurement.tobs)).filter(Measurement.date >= start).filter(Measurement.date <= end).all()
    # Create a dictionary with the results from above calculations
    tobs_start_end_dict = {
        "min_temp": int(results_tobs_start_end[0][0]),
        "max_temp": int(results_tobs_start_end[0][1]),
        "avg_temp": int(results_tobs_start_end[0][2])
    }
    # Jsonify the dictionary
    return jsonify(tobs_start_end_dict)

if __name__ == '__main__':
    app.run(debug=True)
