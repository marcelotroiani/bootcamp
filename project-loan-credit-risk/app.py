from flask import Flask, request, render_template
import pickle
from keras import backend as K

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/predict', methods=['POST','GET'])
def get_delay():
    if request.method=='POST':

        result=request.form

        inputs = [[int(result['annualIncome']), int(result['revolvingBalance']), float(result['dtiRatio']), int(result['loanAmount']), float(result['revolvingUtilizationRate']), 
                int(result['lengthCreditHistory']), int(result['numOpenCreditLines1Year']), int(result['numInquiries6Mon']), int(result['numDerogatoryRec']),
                int(result['numChargeoff1year'])]]
        
        model_files = ['models/tree.pkl', 'models/logreg.pkl', 'models/rf.pkl', 'models/neural.pkl']
        model_names = ['Decision Tree', 'Logistic Regression', 'Random Forest', 'Neural Network']
        outputs = []

        for i in range(0, len(model_names)):
                pkl_file = open(model_files[i], 'rb')
                model = pickle.load(pkl_file)
                if model_names[i] == 'Neural Network':
                        scaler = pickle.load(open('models/XScaler.pkl', 'rb'))
                        inputs_scaled = scaler.transform(inputs)
                        dict = {
                                'Model': model_names[i],
                                'Pred' : model.predict_classes(inputs_scaled)[0],
                                'Prob' : "{:.2%}".format(model.predict_proba(inputs_scaled)[:,1][0])
                        }
                else:
                        dict = {
                                'Model': model_names[i],
                                'Pred' : model.predict(inputs)[0],
                                'Prob' : "{:.2%}".format(model.predict_proba(inputs)[:,1][0])
                        }
                
                if dict['Pred'] == 1:
                        dict['Pred'] = "Default/Denied"
                else:
                        dict['Pred'] = "Approved"

                outputs.append(dict)
        
        K.clear_session()
        
        return render_template('result.html', pred_tree=outputs[0]['Pred'], prob_tree=outputs[0]['Prob'], pred_log=outputs[1]['Pred'], prob_log=outputs[1]['Prob'],
                pred_rf=outputs[2]['Pred'], prob_rf=outputs[2]['Prob'], pred_deep=outputs[3]['Pred'], prob_deep=outputs[3]['Prob'])
    
if __name__ == '__main__':
	app.debug = True
	app.run()