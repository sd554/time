import gspread, pprint, time, os
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds']
creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
client = gspread.authorize(creds)

sheet = client.open('Lab Attendance').sheet1
sheet2 = client.open('Sample Sheet').sheet1

date = time.strftime("%d/%m/%Y")
cols = sheet.col_values(1)
nameFile = open("name.txt","r").readline().strip()
name = nameFile.split(",")[0]
mode = nameFile.split(",")[1]
index = None

if not sheet.cell(2,3).value==date:
        while not sheet.cell(2,2).value=="":
                sheet.delete_row(2)

for n in cols:
        if mode=="in" and n=="":
                index = cols.index(n)+1
                break
        elif mode=="in" and n==name:
                break
        elif mode=="out" and n==name:
                index = cols.index(n)+1
                break
        elif mode=="out" and n=="":
                break

row=0
col=0

if mode=="out":
        i=1
        for r in sheet2.col_values(1):
                if r=="Name":
                        row=i
                        break
                i+=1

        i=1
        for c in sheet2.row_values(row):
                if c=="Lab Hours":
                        col=i
                        break
                i+=1

        i=1
        for r in sheet2.col_values(1):
                if r==name:
                        row=i
                        break
                i+=1

if mode=="in" and not index==None:
        milliseconds = int(round(time.time()*1000))
        sheet.insert_row([name,milliseconds],index)
elif not index==None and mode=="out":
        milliseconds = int(round(time.time()*1000))
        previoustime = float(sheet.cell(index,2).value)
        currenttime = float(sheet2.cell(row,col).value)
        recordtime = currentime+round((milliseconds-previoustime)/3600000)
        if not previoustime=="":
                sheet.delete_row(index)
                if recordtime<12:
                        sheet2.update_cell(row,col,recordtime)

os.remove("name.txt")
