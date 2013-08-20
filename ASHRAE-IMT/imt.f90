PROGRAM IMT

!******************************************************************************
!       PROGRAM:                        IMT 1.9
!
!       LANGUAGE:                       FORTRAN 90
!
!       COMPILER:                       NAGWare, FTN90 COMPILER, NT/95 VERSION
!                                       1400 Opus Place, #200, Downers Grove, IL. 60515-5702
!                                       PHONE: (630)671-2337,   FAX (630)971-2706
!
!       PURPOSE:                        Toolkit for calculating linear, change-point linear and
!                                       multiple-linear inverse building energy analysis models
!
!       SPONSOR:                        ASHRAE Research Project 1050 RP
!
!       COPYRIGHT:                      ASHRAE, 2001.
!
!       DEVELOPERS:                     (PI) Kelly Kissock, Ph.D., P.E.
!                                       Associate Professor
!                                       Department of Mechanical and Aerospace Engineering 
!                                       University of Dayton
!                                       300 College Park, Dayton, Ohio 45419-0210
!                                       PHONE: (937)229-2835,   FAX: (937)229-2852
!
!                                       (CoPI) Jeff S. Haberl, Ph.D., P.E.
!                                       Associate Professor
!                                       Department of Architecture
!                                       Energy Systems Laboratory
!                                       Texas A&M University, College Station, TX 77843
!                                       PHONE: (409)845-6065,   FAX: (409)862-2457
!
!                                       (CoPI) David E. Claridge, Ph.D., P.E.
!                                       Professor
!                                       Department of Mechanical Engineering
!                                       Energy Systems Laboratory
!                                       Texas A&M University, College Station, TX 77843
!
!       PROGRAMMERS:                    Kelly Kissock
!
!                                       John Kie-Whan Oh
!                                       Ph.D. Student, Department of Architecture
!                                       Texas A&M University, College Station, TX 77843
!
!                                       Yoon-Jung Hur
!                                       Ph.D. Student, Department of Computer Science
!                                       Texas A&M University, College Station, TX 77843
!
!       DATE:                           July 7, 2001
! ******************************************************************************
!SUBROUTINES CALLED:
!Process_Cmd_Line
!Get_NumRowsCols
!Read_Data
!FillDNonUni 
!Fill_XY
!MeanM
!MVR
!ThreePMVR
!FourPMVR
!FivePMVR
!VBDD
!Create_Out_File
!Create_Screen_Output 
!
!FUNCTIONS CALLED:
!None
! ******************************************************************************


    !Declare Internal Variables.
	IMPLICIT NONE
	INTEGER, PARAMETER :: MaxNumXVars = 6
	INTEGER, PARAMETER :: MaxFileName = 48
	CHARACTER (LEN=MaxFileName) :: CmdLine
	CHARACTER (LEN=MaxFileName) :: DatFile
	CHARACTER (LEN=MaxFileName) :: OutFile
	CHARACTER (LEN=MaxFileName) :: ResFile
	INTEGER :: ErrorNo = 0
	INTEGER :: NDFlag
	INTEGER :: RegType
	INTEGER :: WeightFld
	INTEGER :: GrpFld
	INTEGER :: GrpVal
	INTEGER :: ResidMode
	INTEGER :: NumXVars
	INTEGER :: YFld
	INTEGER, ALLOCATABLE :: XFld(:)
	INTEGER :: TempXFld(MaxNumXVars)
	INTEGER :: Flag
	INTEGER :: TFld
	INTEGER :: Base
	INTEGER :: NumRows
	INTEGER :: NumCols
	REAL, ALLOCATABLE :: D(:,:)
	REAL, ALLOCATABLE :: X(:,:)
	REAL, ALLOCATABLE :: Y(:,:)
	REAL, ALLOCATABLE :: TempX(:,:)
	REAL, ALLOCATABLE :: TempY(:,:)
	REAL, ALLOCATABLE :: Hdd(:,:)
	REAL, ALLOCATABLE :: Cdd(:,:)
	REAL, ALLOCATABLE :: Beta(:,:)
	REAL, ALLOCATABLE :: GoodRec(:)
	REAL, ALLOCATABLE :: Dds(:,:)
	CHARACTER, ALLOCATABLE :: F(:,:)
	INTEGER :: N, N1, N2
	REAL, ALLOCATABLE :: Coefs(:)
	REAL, ALLOCATABLE :: Sigma(:)
	REAL :: Version 
	REAL :: Xcp1
	REAL :: SeXcp1
	REAL :: Xcp2
	REAL :: SeXcp2
	REAL :: Ycp
	REAL :: SeYcp
	REAL :: RS
	REAL :: SeRS
	REAL :: LS
	REAL :: SeLS
	REAL :: Xcp
	REAL :: SeXcp
	REAL :: Slope
	REAL :: SeSlope
	REAL :: R2
	REAL :: AdjR2
	REAL :: RMSE
	REAL :: CVRMSE
	REAL :: P
	REAL :: DW
	REAL :: YMean
	REAL :: StdDev
	REAL :: CVStdDev
	REAL :: IVCoefs(8)
	REAL :: SeIVCoefs(8)
	INTEGER :: I,J
	
	CHARACTER (LEN=80):: Output
	CHARACTER (LEN=80):: Resput

	!Set the output file names.
	CALL GET_COMMAND_ARGUMENT(2, Output)
	CALL GET_COMMAND_ARGUMENT(3, Resput)
	
	!username=TRIM(username)
	OutFile = Output
	ResFile = Resput
        Version = 1.9
	
	!Initialize  IVCoefs and SeIVCoefs	
	DO I = 1,8
		IVCoefs(I) = 0
		SeIVCoefs (I) = 0
	END DO

	!Get instructions from file or keyboard
	CALL Process_Cmd_line ( Version, DatFile, RegType, WeightFld, &
		GrpFld, GrpVal, ResidMode, NumXVars, YFld, TempXFld, NDFlag, ErrorNo )
	IF (ErrorNo /= 0) GO TO 900 
	
	!Calculate the total number of rows and columns in the data input file.
	CALL Get_NumRowsCols (DatFile, NumRows, NumCols, ErrorNo)
	IF (ErrorNo /= 0) GO TO 900

	! Read data input file.
	WRITE(*,*) "Reading data file..."
	ALLOCATE (D(NumRows, NumCols))
	ALLOCATE(GoodRec(NumRows))	
	Flag = 0
	CALL Read_Data (DatFile, NumRows, NumCols, D, F, ErrorNo,Flag)	
	IF ( (RegType == 8) .OR.(RegType == 9)) THEN
		Tfld = TempXFld(1)
		ALLOCATE (Hdd(NumRows, 40), Cdd(NumRows,40))     
		CALL FillDNonUni(NumRows,NumCols,D,Yfld,Tfld,NdFlag,Hdd,Cdd)
	END IF

	! Fill the arrays X() and Y().
	WRITE(*,*) "Filling X() and Y()..."
	ALLOCATE (TempX(NumRows, NumXVars + 1))
	ALLOCATE (TempY(NumRows,1))
	ALLOCATE (XFld(NumXVars))
	XFld(1:NumXVars) = TempXFld(1:NumXVars)
	CALL Fill_XY(GoodRec,D, NumRows, NumXVars, XFld, YFld, GrpFld, GrpVal, TempX, &
		TempY, N,NDFlag, ErrorNo)
	ALLOCATE (X(N, NumXVars + 1))
	ALLOCATE (Y(N, 1))
	X(1:N, 1:NumXVars+1) = TempX(1:N, 1:NumXVars+1)
	Y(1:N, 1) = TempY(1:N, 1)        
	IF (ErrorNo /= 0) GO TO 900
	
	! Call the proper regression model        
	SELECT CASE (RegType)
	CASE (1)	! Mean Model
		CALL MeanM(X, Y, N, YMean, StdDev, CVStdDev, ErrorNo)

	CASE (2)	! 2P Model
		NumXVars = 1
		ALLOCATE (Coefs(NumXVars + 1))
		ALLOCATE (Sigma(NumXVars + 1))
		CALL MVR(X, Y, N, NumXVars, Coefs, Sigma, R2, AdjR2, RMSE, &
			CVRMSE, P, DW, ErrorNo)

	CASE (3)	! 3P Cooling MVR Model
		CALL ThreePMVR(X, Y, N, NumXVars, 0, Xcp, SeXcp, Ycp, SeYcp, &
			Slope, SeSlope, R2, AdjR2, RMSE, CVRMSE, P, DW, N1, N2, &
			IVCoefs, SeIVCoefs, ErrorNo)
		
	CASE (4)	! 3P Heating MVR Model
		CALL ThreePMVR(X, Y, N, NumXVars, 1, Xcp, SeXcp, Ycp, SeYcp, &
			Slope, SeSlope, R2, AdjR2, RMSE, CVRMSE, P, DW, N1, N2, &
			IVCoefs, SeIVCoefs, ErrorNo)
		
	CASE (5)	! 4P MVR Model
		CALL FourPMVR(X, Y, N, NumXVars, Xcp, SeXcp, Ycp, SeYcp, LS, SeLS, &
			RS, SeRS, R2, AdjR2, RMSE, CVRMSE, P, DW, N1, N2, &
			IVCoefs, SeIVCoefs, ErrorNo)
		
	CASE (6)	! 5P MVR Model
		CALL FivePMVR(X, Y, N, NumXVars, Xcp1, SeXcp1, Xcp2, SeXcp2, Ycp, &
			SeYcp, LS, SeLS, RS, SeRS, R2, AdjR2, RMSE, CVRMSE, P, DW, &
			IVCoefs,SeIVCoefs, ErrorNo)
		
	CASE (7)	! MVR Model
		ALLOCATE (Coefs(NumXVars + 1))
		ALLOCATE (Sigma(NumXVars + 1))		
		CALL MVR(X, Y, N, NumXVars, Coefs, Sigma, R2, AdjR2, RMSE, &
			CVRMSE, P, DW, ErrorNo)

	CASE (8)        ! Best-fit HDD Model
		ALLOCATE (Coefs(NumXVars + 1))
		ALLOCATE (Sigma(NumXVars + 1))
		CALL VBDD(D,NumRows,YFld,GrpFld,GrpVal,NDFlag,Hdd,N,Base,&
		Coefs,Sigma,R2,ADJR2,RMSE,CVRMSE,P,DW,GoodRec)

	CASE (9)        ! Best-fit CDD Model
		ALLOCATE (Coefs(NumXVars + 1))
		ALLOCATE (Sigma(NumXVars + 1))
		CALL VBDD(D,NumRows,YFld,GrpFld,GrpVal,NDFlag,Cdd,N,Base,&
		Coefs,Sigma,R2,ADJR2,RMSE,CVRMSE,P,DW,GoodRec)

	END SELECT


	!Create output file.
	IF (ResidMode == 0) THEN
		WRITE(*,*) "Creating IMT.OUT ..."
	ELSE
		WRITE(*,*) "Creating IMT.OUT and IMT.RES ..."
	END IF
	WRITE(*,*)
	WRITE(*,*) 
900	CALL Create_Out_File (OutFile,ResFile, RegType,ResidMode,Version, ErrorNo)
	CALL Create_Screen_Output (OutFile,ResFile, RegType,ResidMode,Version, ErrorNo)

CONTAINS










! ******************************************************************************
SUBROUTINE Process_Cmd_line (Version,DatFile, RegType,  WeightFld, &
         		GrpFld, GrpVal, ResidMode, NumXVars, YFld, TempXFld,NDFlag, ErrorNo)
! ******************************************************************************
!       PURPOSE:              Process Command Line
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       None
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       DatFile:              Input data file name
!       RegType:              Number of Regression Type (1 to 7)
!       WeightFld:            Column number of Weight indicator (0, if non-weighted)
!       GrpFld:               Column number of the Grouping variables (0, if unused)
!       GrpVal:               Value in GrpFld that indicates the group for X() and Y()
!       ResidMode:            Make a Residual file, or not (1 = Yes, 0 = No)
!       NumXVars:             Number of X (independent) variables (0 through 6)
!       YFld:                 Column number of Y (dependent) variable
!       XFld:                 Column numbers of X (indep.) variables (0,if unused)
!       ErrorNo:              Error Trapping No (0, if no error)
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Check_Valid_Pathname
!       Get_Value_from_User
!       Help
!       Read_Instruction
!       CmdLineIsBlank
!       CmdLineIsDoubleQuestion
!       CmdLineIsQuestion
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------
!       INTERNAL VARIABLES:
!       InsFile:             Instruction file name
!       CmdLine              CommandLine Input 
!       Response             Indicator for user to continue or stop
!       R                    Notice that file name is valid
!       TRUE                 Value to notify truth or false of statement
!       ----------------------------------------------------------------------------
! ******************************************************************************

	intrinsic LEN_TRIM
	! Declare Input/Output Variables.
	CHARACTER (LEN=48), INTENT(OUT) :: DatFile
	Real,	 INTENT(IN)  :: Version
	INTEGER, INTENT(OUT) :: RegType
	INTEGER, INTENT(OUT) :: WeightFld
	INTEGER, INTENT(OUT) :: GrpFld
	INTEGER, INTENT(OUT) :: GrpVal
	INTEGER, INTENT(OUT) :: ResidMode
	INTEGER, INTENT(OUT) :: NumXVars
	INTEGER, INTENT(OUT) :: YFld
	INTEGER, INTENT(OUT) :: TempXFld(:)
	INTEGER, INTENT(IN OUT) :: ErrorNo
	INTEGER, INTENT(OUT)  :: NdFlag		
	! Declare Internal Variables.
	LOGICAL :: TRUE,COND1,COND2,COND3
	CHARACTER (LEN=100):: Response
	CHARACTER (LEN=100) :: CmdLine
	CHARACTER (LEN=100) :: InsFile
	CHARACTER (LEN=48)  :: Cmd
	INTEGER :: R
	INTEGER :: i
	TRUE =.TRUE.
	
	! Check whether file extension is instruction file or not
	CALL GET_COMMAND_ARGUMENT(1, CmdLine)
	
	IF (CmdLine ==' ') THEN
	
		WRITE(*,*)
		WRITE(*,"(A52, F3.1,A1)") "Welcome to ASHRAE Inverse Modeling ToolKit (Version ",Version,")"
		WRITE(*,'(a)',ADVANCE='NO') "For help enter '?'.  To quit enter 'q' at any time."
		WRITE(*,*) 
		WRITE(*,*) 
100		WRITE(*,'(a)',ADVANCE='NO') "Enter path and name of instruction file or 0 to run from keyboard:"
		READ(*,'(a)') Cmd
		!Cmd = 'daily2.ins'
		!Cmd = 'nonunipp.ins'
		IF (Cmd == '?') THEN
			WRITE(*,*)
			WRITE(*,*)"To run IMT, you must enter instructions about the model type and"
			WRITE(*,*)"the location and structure of the data file."
			WRITE(*,*)" "
			WRITE(*,*)"You can enter these instructions using an instruction file or via"
			WRITE(*,*)"the keboard.  To enter instructions from an instruction file, type "
			WRITE(*,*)"the path and file name of the instruction file.  To enter instructions"
			WRITE(*,*)"from the keyboard, type '0'."
			WRITE(*,*)
			GO TO 100	
		ELSE IF ((Cmd == 'quit') .OR. (Cmd == 'q') .OR. (Cmd == 'QUIT') .OR. (Cmd == 'Q')) THEN
			STOP		
		ELSE IF (Cmd == '0') THEN
			CALL	Get_Ins_from_Keyboard(DatFile,NDFlag,RegType,  WeightFld, &
				GrpFld, GrpVal, ResidMode, NumXVars, YFld, TempXFld ,ErrorNo)
		ELSE IF (LEN_TRIM(Cmd) == 0 ) THEN     
			GO TO 100 
		ELSE
			InsFile = Cmd
			CALL Check_Valid_Pathname(InsFile,R,ErrorNo)
			IF (R == 1) THEN
				ErrorNo = 0
				CALL Get_Ins_from_InsFile (InsFile, DatFile, RegType,  WeightFld, &
				GrpFld, GrpVal, ResidMode, NumXVars, YFld, TempXFld, NDFlag, ErrorNo)
			ELSE
				WRITE(*,*)
				WRITE(*,*) "Input Error."
				WRITE(*,*) "To enter instructions from an instruction file, type "
				WRITE(*,*) "the path and file name of the instruction file.  To enter " 
				WRITE(*,*) "instructions from the keyboard, type '0'.  To quit type 'q'."
				WRITE(*,*)
				GO TO 100
			END IF
		END IF

	ELSE

		!use command line as name of instruction file
		InsFile = CmdLine
		CALL Check_Valid_Pathname(InsFile,R,ErrorNo)
		IF (R == 1) THEN
			ErrorNo = 0
			CALL Get_Ins_from_InsFile (InsFile, DatFile, RegType,  WeightFld, &
			GrpFld, GrpVal, ResidMode, NumXVars, YFld, TempXFld,NDFlag,ErrorNo)
		ELSE 
			WRITE(*,*)
			WRITE(*,*) "Input Error."
			WRITE(*,*) "Command line argument for Inverse Modeling Toolkit must "
			WRITE(*,*) "be valid path and filename of instruction file." 
			WRITE(*,*)
			STOP
		END IF
	END IF 

101 END SUBROUTINE Process_Cmd_line












! ******************************************************************************
SUBROUTINE Get_Ins_from_Keyboard( DatFile, NDFlag,RegType,  WeightFld, &
				GrpFld, GrpVal, ResidMode, NumXVars, YFld, TempXFld,ErrorNo)
! ******************************************************************************
!       PURPOSE:              Get Instructions From Keyboard
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       None
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       DatFile:              Input data file name
!       NDFlag:               No data flag
!       RegType:              Number of Regression Type (1 to 7)
!       WeightFld:            Column number of Weight indicator (0, if non-weighted)
!       GrpFld:               Column number of the Grouping variables (0, if unused)
!       GrpVal:               Value in GrpFld that indicates the group for X() and Y()
!       ResidMode:            Make a Residual file, or not (1 = Yes, 0 = No)
!       NumXVars:             Number of X (independent) variables (0 through 6)
!       YFld:                 Column number of Y (dependent) variable
!       TempXFld:             Column numbers of X (indep.) variables (0,if unused)
!       ErrorNo:              Error Trapping No (0, if no error)
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Check_Valid_Pathname
!       Get_NumRowsCols
!       Check_For_Chars 
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       LEN_TRIM 
!       ----------------------------------------------------------------------------     
!       INTERNAL VARIABLES:
!       I
!       J 
!       Input
!       Illchar
!       NumRows
!       NumCols
!       R
!       TstDatFile
!       ----------------------------------------------------------------------------
! ******************************************************************************

	INTRINSIC ACHAR		
	CHARACTER (LEN=48), INTENT(OUT) :: DatFile
	INTEGER, INTENT(OUT) :: NdFlag
	INTEGER, INTENT(OUT) :: RegType
	INTEGER, INTENT(OUT) :: WeightFld
	INTEGER, INTENT(OUT) :: GrpFld
	INTEGER, INTENT(OUT) :: GrpVal
	INTEGER, INTENT(OUT) :: ResidMode
	INTEGER, INTENT(OUT) :: NumXVars
	INTEGER, INTENT(OUT) :: YFld
	INTEGER, INTENT(OUT) :: TempXFld(:)
	INTEGER, INTENT(IN OUT) :: ErrorNo	
	! Declare Internal Variables.
	INTEGER :: I
	CHARACTER :: J
	CHARACTER (LEN=48) :: Input
	INTEGER :: IllChar
	INTEGER :: NumRows
	INTEGER :: NumCols
	INTEGER :: R
	CHARACTER (LEN=100) :: TstDatFile
	
	! Read instruction from keyboard
10	WRITE(*,'(a)',ADVANCE='NO') "Enter path and name of data file: "
	READ (*,'(a)') Input 
	IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN          
		STOP 
	ELSE IF (Input == '?') THEN 
		WRITE(*,*) " "
		WRITE(*,*)"IMT identifies regression models of building energy use."
		WRITE(*,*)"IMT reads the energy use data from ASCII data files."
		WRITE(*,*)"Enter path and name of data file to process: "
		WRITE(*,*)" "
		GO TO 10
	ELSE IF (LEN_TRIM(Input) == 0 ) THEN		
		GO TO 10
        ELSE
                !test for valid file name and path
		TstDatFile = Input
		CALL Check_Valid_Pathname(TstDatFile,R,ErrorNo)
                IF (R /= 1) THEN
			WRITE(*,*)
			WRITE(*,*) "Data Input Error."
			WRITE(*,*) "Not a valid path and file name for data file. " 
			WRITE(*,*)
			GO TO 10
                END IF

                !Get num cols to bound check column number inputs below
                ErrorNo = 0
                DatFile = Input
                CALL Get_NumRowsCols (DatFile, NumRows, NumCols, ErrorNo)
                IF (ErrorNo /= 0) THEN
                        WRITE(*,*)
                        WRITE(*,*) "Error."
                        WRITE(*,*) "Error reading data file."
                        WRITE(*,*)
                        GO TO 10
                END IF
	END IF


20	WRITE(*,'(a)',ADVANCE='NO') "Enter value of no-data flag (optional): " 
	READ (*,'(a)') Input
	CALL Check_For_Chars( Input, IllChar)
	IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN
		STOP 
	ELSE IF (Input == '?') THEN		
		WRITE(*,*) " "
		WRITE(*,*)"Data file records may contain fields for which no valid data are"
		WRITE(*,*)"available.  Those fields should contain 'no-data markers'.  The "
		WRITE(*,*)"default no-data marker is '-99'.  Press the 'Enter' key to"
		WRITE(*,*)"use the default no-data marker.  Enter an integer value to define"
		WRITE(*,*)"a different no-data marker.  IMT will automatically exclude fields"
		WRITE(*,*)"with no-data markers from the analysis."
		WRITE(*,*)" "
		GO TO 20
	ELSE IF (LEN_TRIM(Input) == 0 ) THEN		
		NDFlag = -99
	ELSE IF (IllChar == 1) THEN     
		WRITE(*,*) " "
		WRITE(*,*) "Data Input Error"
		WRITE(*,*) "Acceptable input are 'q', '?', typing the Enter key, or an integer value."
		WRITE(*,*) " "
		GO TO 20
	ELSE
		READ(Input,"(i10)") NDFlag        
	END IF

30	WeightFld = 0

40	WRITE(*,'(a)',ADVANCE='NO') "Enter column of group field or '0' if no grouping: "
	Read(*,'(a)') Input
	CALL Check_For_Chars( Input, IllChar)
	IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN          
		STOP 
	ELSE IF (Input == '?') THEN		
		WRITE(*,*) " "
		WRITE(*,*) "To process a subset of the data in the data file, define a field"
		WRITE(*,*) "in the data file as the group field and place the same integer"
		WRITE(*,*) "value in every record that you wish to process.  IMT will only "
		WRITE(*,*) "process records for which the value in the group field matches"
		WRITE(*,*) "the value defined as the group value.  If no grouping is to be"
		WRITE(*,*) "performed then enter '0' as the grouping field."
		WRITE(*,*)" "
		GO TO 40
	ELSE IF (LEN_TRIM(Input) == 0 ) THEN		
		GO TO 40
	ELSE IF (IllChar == 1) THEN     
		WRITE(*,*) " "
		WRITE(*,*) "Data Input Error"
		WRITE(*,*) "Acceptable input are 'q', '?', or an integer value."
		WRITE(*,*) " "
		GO TO 40
	ELSE
		Read(Input,"(i3)") GrpFld
		IF ((GrpFld .GT. NumCols) .OR. (GrpFld .LT. 0))THEN
			WRITE(*,*) " "
			WRITE(*,*) "Data Input Error"
			WRITE(*,*) "The group field must be a number from 0 to the max number of columns"
			WRITE(*,*) "in the data file, which is ", numcols, "."
			WRITE(*,*) " "
			GO TO 40
		ELSEIF (GrpFld == 0) THEN
			GO TO 60
		END IF			 
	END IF
	
50	WRITE(*,'(a)',ADVANCE='NO') "Enter value in grouping field which indicates record should be processed: "
	Read(*,'(a)') Input
	CALL Check_For_Chars( Input, IllChar)
	IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN
		STOP 
	ELSE IF (Input == '?') THEN
		WRITE(*,*) " "
		WRITE(*,*) "To process a subset of the data in the data file, define a field"
		WRITE(*,*) "in the data file as the group field and place the same integer"
		WRITE(*,*) "value in that field in every record that you wish to process."
		WRITE(*,*) "IMT will only process records for which the value in the group"
		WRITE(*,*) "field matches the value defined as the group value.  If"
		WRITE(*,*) "grouping is to be performed then enter '0' as the grouping field."
		WRITE(*,*)" "
		GO TO 50
	ELSE IF (LEN_TRIM(Input) == 0 ) THEN
		GO TO 50
	ELSE IF (IllChar == 1) THEN
		WRITE(*,*) " "
		WRITE(*,*) "Data Input Error"
		WRITE(*,*) "Acceptable input are 'q', '?', or an integer value."
		WRITE(*,*) " "
		GO TO 50
	ELSE
		Read(Input,"(i10)") GrpVal
	END IF

60	WRITE(*,'(a)',ADVANCE='NO') "Enter '1' for residual file or '0' for no residual file: "
	Read(*,'(a)') Input
	CALL Check_For_Chars( Input, IllChar)
	IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN          
		STOP 
	ELSE IF (Input == '?') THEN
		WRITE(*,*) " "
		WRITE(*,*) "IMT can generate a residual file which includes measured input data, predicted"
		WRITE(*,*) "values of the dependent variable and the difference between the measured and"
		WRITE(*,*) "predicted values (the residual). To generate this file (called 'IMT.RES'),"
		WRITE(*,*) "enter '1', otherwise enter '0'."
		WRITE(*,*)" "
		GO TO 60
	ELSE IF (LEN_TRIM(Input) == 0 ) THEN
		GO TO 60
	ELSE IF (IllChar == 1) THEN     
		WRITE(*,*) " "
		WRITE(*,*) "Data Input Error"
		WRITE(*,*) "Acceptable input are 'q', '?', or an integer value."
		WRITE(*,*) " "
		GO TO 60
	ELSE
		Read(Input,"(i3)") ResidMode
		IF ( (ResidMode == 1).OR. (ResidMode == 0)) THEN

		ELSE 
			GO TO 60
		END IF			
	END IF
	
70	WRITE(*,'(a)') "Enter model type [1 for Mean, 2 for 2P, 3 for 3PC, 4 for 3PH, 5 for 4P" 
	WRITE(*,'(a)',ADVANCE='NO') "6 for 5P, 7 for MVR, 8 for HDD, 9 for CDD]: "
	Read(*,'(a)') Input
	CALL Check_For_Chars( Input, IllChar)
	IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN          
		STOP 
	ELSE IF (Input == '?') THEN		
		WRITE(*,*) " "
		WRITE(*,*) "IMT can generate nine different regression models.  The models are"
		WRITE(*,*) "described in the IMT program documenation.  Select and enter the appropriate"
		WRITE(*,*) "model type."
		WRITE(*,*)" "
		GO TO 70
	ELSE IF (LEN_TRIM(Input) == 0 ) THEN
		GO TO 70
	ELSE IF (IllChar == 1) THEN     
		WRITE(*,*) " "
		WRITE(*,*) "Data Input Error"
		WRITE(*,*) "Acceptable input are 'q', '?', or an integer value."
		WRITE(*,*) " "
		GO TO 70
	ELSE
		Read(Input,"(i3)") RegType       
		IF ((RegType == 1) .OR. (RegType == 2) .OR. (RegType == 3) .OR. (RegType == 4) &
			.OR. (RegType == 5) .OR. (RegType == 6) .OR. (RegType == 7) .OR. (RegType == 8) &
			.OR. (RegType == 9)) THEN

		ELSE 
			GO TO 70
		END IF
	END IF

80	WRITE(*,'(a)',ADVANCE='NO') "Enter column of Y (dependent) variable: "  
	Read(*,'(a)') Input
	CALL Check_For_Chars( Input, IllChar)
	IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN          
		STOP 
	ELSE IF (Input == '?') THEN		
		WRITE(*,*) " "
		WRITE(*,*) "Enter the column number of the variable you wish to model."
		WRITE(*,*) " "
		GO TO 80
	ELSE IF (LEN_TRIM(Input) == 0 ) THEN
		WRITE(*,*) " "
		WRITE(*,*) "Data Input Error"
		WRITE(*,*) "Acceptable input are 'q', '?', or an integer value."
		WRITE(*,*) " "
		GO TO 80
	ELSE
		Read(Input,"(i3)") YFld
		IF ((YFld .GT. NumCols) .OR. (YFld .LT. 1)) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Data Input Error"
			WRITE(*,*) "The Y field must be a number from 1 to the max number of columns"
			WRITE(*,*) "in the data file, which is ", numcols, "."
			WRITE(*,*) " "
			GO TO 80
		END IF
	END IF


90	IF (RegType == 1) THEN
		NumXVars = 0
	ELSE IF ((RegType == 2) .OR. (RegType == 8) .OR. (RegType == 9)) THEN
		NumXVars= 1
	ELSE
		WRITE(*,'(a)',ADVANCE='NO') "Enter number of X (independent) variables: "
		Read(*,'(a)') Input
		CALL Check_For_Chars( Input, IllChar)

		IF ((Input == 'quit') .OR. (Input == 'q') .OR. (Input == 'QUIT') .OR. (Input == 'Q')) THEN
			STOP 
		ELSE IF (Input == '?') THEN      
			WRITE(*,*) " "
			WRITE(*,*) "The MVR model can accomodate up to 7 independent variables, in a multi-"
			WRITE(*,*) "variable linear-regression model.  The 3P, 4P and 5P change-point models"
			WRITE(*,*) "can also accomodate more than one independent variables; however, the"
			WRITE(*,*) "change-point algorithm is computed only on the first independent variable."
			WRITE(*,*) "The 3P models can accomodate up to 4 independent variables, the 4P model"
			WRITE(*,*) "can accomodate up to 3 independent variables, and the 5P model can"
			WRITE(*,*) "accomodate up to 2 independent variables.  Enter the number of independent"
			WRITE(*,*) "variables you wish to consider."
			WRITE(*,*) " "
			GO TO 90        
		ELSE IF (LEN_TRIM(Input) == 0 ) THEN
			GO TO 90
		ELSE IF (IllChar == 1) THEN     
			WRITE(*,*) " "
			WRITE(*,*) "Data Input Error"
			WRITE(*,*) "Acceptable input are 'q', '?', or an integer value."
			WRITE(*,*) " "
			GO TO 90
		ELSE
			Read(Input,"(i3)") NumXVars
		END IF

		IF (((REGTYPE == 3) .OR. (REGTYPE == 4)) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 4))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Data Input Error"
			WRITE(*,*) "For 3P model, Number of X variables must be greater than 0 and less than 5."
			WRITE(*,*) " "
			GO TO 90
		ELSEIF ((REGTYPE == 5) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 3))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Data Input Error"
			WRITE(*,*) "For 4P model, Number of X variables must be greater than 0 and less than 4."
			WRITE(*,*) " "
		GO TO 90
			ELSEIF ((REGTYPE == 6) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 2))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Data Input Error"
			WRITE(*,*) "For 5P model, Number of X variables must be greater than 0 and less than 3."
			WRITE(*,*) " "
			GO TO 90
		ELSEIF ((REGTYPE == 7) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 6))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Data Input Error"
			WRITE(*,*) "For MVR model, Number of X variables must be greater than 0 and less than 7."
			WRITE(*,*) " "
			GO TO 90
		END IF
	END IF


100	IF (NumXVars /= 0) THEN  

		DO I = 1, NumXVars
102			WRITE(*,'("Enter column of X[",I1,"] (independent) variable: ")',ADVANCE='NO') I
			READ(*,'(a)') Input
			CALL Check_For_Chars( Input, IllChar)
			IF (LEN_TRIM(Input) == 0 ) THEN
				GO TO 102
			ELSE IF (IllChar == 1) THEN     
				WRITE(*,*) " "
				WRITE(*,*) "Data Input Error"
				WRITE(*,*) "Acceptable input are 'q', '?', or an integer value."
				WRITE(*,*) " "
				GO TO 102
			ELSE
				READ(Input,"(i3)") TempXFld(I)
				IF ((TempXFld(I) .GT. NumCols) .OR. (TempXFld(I) .LT. 1))THEN
					WRITE(*,*) " "
					WRITE(*,*) "Data Input Error"
					WRITE(*,*) "The X field must be a number from 1 to the max number of columns"
					WRITE(*,*) "in the data file, which is ", numcols, "."
					WRITE(*,*) " "
					GO TO 102
				END IF
			END IF
		END DO
	END IF

	!print empty line
	WRITE(*,*) " "

400 END SUBROUTINE Get_Ins_from_Keyboard








! ******************************************************************************
SUBROUTINE Get_Ins_from_InsFile (CmdLine, DatFile, RegType,  WeightFld,&
	GrpFld, GrpVal, ResidMode, NumXVars, YFld, TempXFld,NDFlag,ErrorNo)
! ******************************************************************************
!       PURPOSE:          Get Instructions From Instruction File
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       CmdLine
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       DatFile:          Input data file name
!       RegType:          Number of Regression Type (1 to 7)
!       WeightFld:        Column number of Weight indicator (0, if non-weighted)
!       GrpFld:           Column number of the Grouping variables (0, if unused)
!       GrpVal:           Value in GrpFld that indicates the group for X() and Y()
!       ResidMode:        Make a Residual file, or not (1 = Yes, 0 = No)
!       NumXVars:         Number of X (independent) variables (0 through 6)
!       YFld:             Column number of Y (dependent) variable
!       TempXFld:         Column numbers of X (indep.) variables (0,if unused)
!       NDFlag:           No data flag
!       ErrorNo:          Error Trapping No (0, if no error)
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       ParserForInsFile
!       Check_Valid_Pathname
!       Get_NumRowsCols
!       Check_For_Chars 
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       LEN_TRIM 
!       ----------------------------------------------------------------------------      
!       INTERNAL VARIABLES:
!       InsFile:             Instruction file name
!       InLine 
!       InLineb
!       Cht
!       I
!       ios
!       J
!       Flag
!       Number
!       Status
!       R                    Notice that file name is valid
!       TstDatFile
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	CHARACTER (LEN=100), INTENT(OUT) :: CmdLine
	CHARACTER (LEN=48), INTENT(OUT) :: DatFile
	INTEGER, INTENT(OUT) :: RegType
	INTEGER, INTENT(OUT) :: WeightFld
	INTEGER, INTENT(OUT) :: GrpFld
	INTEGER, INTENT(OUT) :: GrpVal
	INTEGER, INTENT(OUT) :: ResidMode
	INTEGER, INTENT(OUT) :: NumXVars
	INTEGER, INTENT(OUT) :: YFld
	INTEGER, INTENT(OUT) :: TempXFld(:)
	INTEGER, INTENT(OUT) :: NDFlag
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	CHARACTER (LEN=200) :: InsFile
	CHARACTER (LEN=400) :: InLine, InLineb
	CHARACTER (LEN=200)  :: Cht
	INTEGER :: I,ios,J, Flag, Number
	INTEGER :: Status	
	INTEGER :: R
	CHARACTER (LEN=100) :: TstDatFile
	Status = 0
	
	
	! Read the Instruction.
	InsFile = CmdLine
	WRITE(*,*)
	WRITE(*,*) "Reading instruction file..."
	
	NumXVars = 5
	J = 0
	OPEN(UNIT = 10,FILE = InsFile)
	
	!read data file name and open it
10	READ(10,'(A300)') InLine
	CALL ParserForInsFile(InLine,1,Number,Cht)

	!test for valid path and filename
	TstDatFile = Cht
	CALL Check_Valid_Pathname(TstDatFile,R,ErrorNo)
	IF (R /= 1) THEN
		WRITE(*,*)
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "Not a valid path and file name for data file. " 
		WRITE(*,*)
		STOP
	END IF

	!test if data file can be read
	DatFile = Cht
	CALL Get_NumRowsCols (DatFile, NumRows, NumCols, ErrorNo)

	IF (ErrorNo /= 0) THEN                        
		WRITE(*,*)
		WRITE(*,*) "Error."
		WRITE(*,*) "Error reading data file."
		STOP
	END IF

	!read no-data flag
20	READ(10,'(A300)') InLine 
	CALL ParserForInsFile(InLine,0,Number,Cht)
	IF (Number == -987654321) THEN
		WRITE(*,*)
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "No-Data Flag must be an integer value."
		WRITE(*,*)
		STOP                
	ELSE
		NDFlag = Number
	END IF        
	
	!READ(10,'(A300)') InLine 
	!CALL ParserForInsFile(InLine,0,Number,Cht)
	!WeightFld = Number
30	WeightFld = 0
	
	!read group field
40	READ(10,'(A300)') InLine 
	CALL ParserForInsFile(InLine,0,Number,Cht)        
	IF (Number == -987654321) THEN
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "Group Field must be an integer value."
		WRITE(*,*)
		STOP                
	ELSE
		GrpFld = Number
		IF ((GrpFld .GT. NumCols) .OR. (GrpFld .LT. 0))THEN
			WRITE(*,*) " "
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "The column number of the group field must"
			WRITE(*,*) "be an integer from 0 to ", numcols,", the"
			WRITE(*,*) "max number of columns in the data file."
			WRITE(*,*) " "
			STOP
		END IF 
	END IF
	
	!read grouping value
50	READ(10,'(A300)') InLine 
	CALL ParserForInsFile(InLine,0,Number,Cht)        
	IF (Number == -987654321) THEN
		WRITE(*,*)
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "The value of valid records in the group field must be an integer number."
		WRITE(*,*)
		STOP
	ElSE
		GrpVal =  Number
	END IF
	
	!read residual file indicator
60	READ(10,'(A300)') InLine 
	CALL ParserForInsFile(InLine,0,Number,Cht)        
	IF (Number == -987654321) THEN     
		WRITE(*,*) " "
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "For Residual File, enter '1' to create a residual file"
		WRITE(*,*) "or '0' for no residual file."
		WRITE(*,*) " "
		STOP
	ELSE
		ResidMode = Number
		IF ( (ResidMode == 1).OR. (ResidMode == 0)) THEN
	
		ELSE 
			WRITE(*,*) " "
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "For Residual File, enter '1' to create a residual file"
			WRITE(*,*) "or '0' for no residual file."
			WRITE(*,*) " "
			STOP 
		END IF
	END IF
	
	
	!read regression model type
70	READ(10,'(A300)') InLine 
	CALL ParserForInsFile(InLine,0,Number,Cht)
	RegType  = Number
	IF (Number == -987654321) THEN
		WRITE(*,*)
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "The model type must be an integer number from 1 to 9."
		WRITE(*,*)
		STOP
	ELSE
		IF ((RegType == 1) .OR. (RegType == 2) .OR. (RegType == 3) .OR. (RegType == 4) &
			.OR. (RegType == 5) .OR. (RegType == 6) .OR. (RegType == 7) .OR. (RegType == 8) &
			.OR. (RegType == 9)) THEN
	
		ELSE 
			WRITE(*,*)
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "The model type must be an integer number from 1 to 9."
			WRITE(*,*)
			STOP
		END IF
	END IF
	
	
	!read yfld
80	READ(10,'(A300)') InLine 
	CALL ParserForInsFile(InLine,0,Number,Cht)
	IF (Number == -987654321) THEN
		WRITE(*,*)
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "Column number of Y (independent) variable must be an integer value."
		WRITE(*,*)
		STOP
	ELSE
		YFld = Number
		IF ((YFld .GT. NumCols) .OR. (YFld .LT. 1))THEN
			WRITE(*,*) " "
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "Column number of Y (dependent) variable must"
			WRITE(*,*) "be an integer from 1 to ", numcols,", the"
			WRITE(*,*) "max number of columns in the data file."
			WRITE(*,*) " "
			STOP
		END IF 
	END IF


	!read number of x variables
90	READ(10,'(A300)') InLine 
	CALL ParserForInsFile(InLine,0,Number,Cht)
	IF (Number == -987654321) THEN
		WRITE(*,*)
		WRITE(*,*) "Error in Instruction File:"
		WRITE(*,*) "Number of X (independent) variables must be an integer value."
		WRITE(*,*)
		STOP
	ELSE
		NumXVars = Number
		IF (RegType == 1) THEN
			NumXVars = 0
		ELSE IF ((RegType == 2) .OR. (RegType == 8) .OR. (RegType == 9)) THEN
			NumXVars= 1
		ELSE IF (((REGTYPE == 3) .OR. (REGTYPE == 4)) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 4))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "For 3P model, Number of X variables must be greater than 0 and less than 5."
			WRITE(*,*) " "
			STOP
		ELSEIF ((REGTYPE == 5) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 3))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "For 4P model, Number of X variables must be greater than 0 and less than 4."
			WRITE(*,*) " "
			STOP
		ELSEIF ((REGTYPE == 6) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 2))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "For 5P model, Number of X variables must be greater than 0 and less than 3."
			WRITE(*,*) " "
			STOP
		ELSEIF ((REGTYPE == 7) .AND. ((NUMXVARS .LT. 1) .OR. (NUMXVARS .GT. 6))) THEN
			WRITE(*,*) " "
			WRITE(*,*) "Error in Instruction File:"
			WRITE(*,*) "For MVR model, Number of X variables must be greater than 0 and less than 7."
			WRITE(*,*) " "
			STOP
		END IF
	END IF
	
	
	!read col nums of x variables
100	IF (NumXVars /= 0) THEN
		DO I = 1, NumXVars
			READ(10,'(A300)') InLine
			CALL ParserForInsFile(InLine,0,Number,Cht) 
			IF (Number == -987654321) THEN
				WRITE(*,*)
				WRITE(*,*) "Error in Instruction File:"
				WRITE(*,*) "Column number of X variables must be an integer value."
				WRITE(*,*)
				STOP
			ELSE
				TempXFld(I) = Number
				IF ((TempXFld(I) .GT. NumCols) .OR. (TempXFld(I) .LT. 1))THEN
					WRITE(*,*) " "
					WRITE(*,*) "Error in Instruction File:"
					WRITE(*,*) "Column number of X(",I,") must"
					WRITE(*,*) "be an integer from 1 to ", numcols,", the"
					WRITE(*,*) "max number of columns in the data file."
					WRITE(*,*) " "
					STOP
				END IF
			END IF
		END DO
	END IF
	
	CLOSE(10)

END SUBROUTINE Get_Ins_from_InsFile





! ******************************************************************************
SUBROUTINE Check_For_Chars( Input, IllChar)                                
! ******************************************************************************
!       PURPOSE:               Check for Characters
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       Input:   
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       IllChar  
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------      
!       INTERNAL VARIABLES:
!       None
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Internal Variables.
	CHARACTER (LEN=48), INTENT(IN) :: Input
	 INTEGER, INTENT(OUT) :: IllChar
	
	!check for uppercase characters
	IF ((INDEX(Input,"A") /= 0) .OR. (INDEX(Input,"B") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"C") /= 0) .OR. (INDEX(Input,"D") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"E") /= 0) .OR. (INDEX(Input,"F") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"G") /= 0) .OR. (INDEX(Input,"H") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"I") /= 0) .OR. (INDEX(Input,"J") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"K") /= 0) .OR. (INDEX(Input,"L") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"M") /= 0) .OR. (INDEX(Input,"N") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"O") /= 0) .OR. (INDEX(Input,"P") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"R") /= 0) .OR. (INDEX(Input,"S") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"T") /= 0) .OR. (INDEX(Input,"U") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"V") /= 0) .OR. (INDEX(Input,"W") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"X") /= 0) .OR. (INDEX(Input,"Y") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"Z") /= 0) .OR. (INDEX(Input,",") /= 0))  THEN
		IllChar = 1
	
	!check for lowercase characters
	ELSE IF ((INDEX(Input,"a") /= 0) .OR. (INDEX(Input,"b") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"c") /= 0) .OR. (INDEX(Input,"d") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"e") /= 0) .OR. (INDEX(Input,"f") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"g") /= 0) .OR. (INDEX(Input,"h") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"i") /= 0) .OR. (INDEX(Input,"j") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"k") /= 0) .OR. (INDEX(Input,"l") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"m") /= 0) .OR. (INDEX(Input,"n") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"o") /= 0) .OR. (INDEX(Input,"p") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"r") /= 0) .OR. (INDEX(Input,"s") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"t") /= 0) .OR. (INDEX(Input,"u") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"v") /= 0) .OR. (INDEX(Input,"w") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"x") /= 0) .OR. (INDEX(Input,"y") /= 0))  THEN
		IllChar = 1
	ELSE IF ((INDEX(Input,"z") /= 0))  THEN
		IllChar = 1
	
	!check for period or comma
	ELSE IF ((INDEX(Input,".") /= 0) .OR. (INDEX(Input,",") /= 0))  THEN
		IllChar = 1
	ELSE
		IllChar = 0
	END IF
	
 END SUBROUTINE Check_For_Chars










! ******************************************************************************
SUBROUTINE FillDNonUni (NumRows,NumCols,D,YFld,Tfld,NdFlag,Hdd,Cdd)
! ******************************************************************************
!       PURPOSE:               Fills days that are not uniform
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       Yfld
!       Tfld
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       NumRows
!       NumCols
!       D
!       NdFlag
!       Hdd
!       Cdd
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       NumRecs
!       Tbase
!       I
!       J
!       Tsum
!       Numts
!       D2
!       Tavg
!       Temp1
!       Temp2
!       ----------------------------------------------------------------------------
! ******************************************************************************

	
	INTEGER, INTENT(OUT):: NumRows 
	INTEGER, INTENT(OUT):: NumCols
	REAL,    INTENT(OUT) :: D(:,:)
	INTEGER, INTENT(IN):: YFld
	INTEGER, INTENT(IN):: Tfld
	INTEGER, INTENT(OUT):: NdFlag
	REAL, INTENT(OUT) :: Hdd(:,:)
	REAL, INTENT(OUT) :: Cdd(:,:)
	
	! Declare Internal Variables.
	INTEGER ::I, J, NumRecs,Tbase
	
	REAL, ALLOCATABLE :: Tsum(:)
	REAL, ALLOCATABLE :: Numts(:)
	REAL, ALLOCATABLE :: D2(:,:)
	REAl, ALLOCATABLE :: Tavg(:)
	REAL :: Temp1,Temp2
	
	! Dimension Arrays
	NumRecs = 0
	ALLOCATE (Tsum(NumRows))
	ALLOCATE (Numts(NumRows))
	ALLOCATE (D2(NumRows,NumCols))
	ALLOCATE (Tavg(NumRows))
	
	!Reads the original d(), extracts the energy data records, and calcs tavg, hdd and cdd		
	DO I = 1, NumRows
		DO J = 1, 40
			Cdd(I,J) = 0
			Hdd(I,J) = 0
		END DO
	END DO
	
	!Finds the sums: tsum, cdd and hdd
	NumRecs = 0
	DO I = 1, NumRows                
		IF (D(I, Tfld) /= NdFlag) THEN        		
			Numts(NumRecs + 1) = Numts(NumRecs + 1) + 1        		  		
			TSum(NumRecs + 1 ) = TSum(NumRecs + 1 ) + D(I,Tfld)
				        	
			DO Tbase = 41 , 80
				IF ((D(I,Tfld) - Tbase) > 0) THEN
					Cdd(NumRecs + 1, Tbase - 40) = Cdd(NumRecs +1, Tbase - 40 ) + (D(I,Tfld) - Tbase)
				END IF
				IF ((Tbase - D(I,Tfld)) > 0) THEN
					Hdd(NumRecs + 1, Tbase - 40) = Hdd(NumRecs + 1, Tbase - 40) + (Tbase - D(I,Tfld))
				END IF
			END DO
		END IF
	
		! Saves recs with energy data in d2( )
		IF (D(I,YFld) /= NdFlag ) THEN
			NumRecs = NumRecs + 1
			DO J = 1, NumCols
				D2(NumRecs, J) = D(I,J)
			END DO
		END IF
	END DO
	
	! Divides by number of values to get tavg() and replaces daily values t with avg value
	DO I = 1, NumRecs
		! Divides by number of values to get tavg() 
		IF (NumTs(I) > 0 ) THEN
			Tavg(I) = Tsum(I) / Numts(I)
		ELSE
			Tavg(I) = NdFlag
		END IF
	END DO
	
	! Transfers D2 To D() but ignores  first energy use record	
	DO I = 2, NumRecs
		DO J = 1, NumCols
			D(I - 1, J) = D2(I,J)
			D(I - 1, TFld) = Tavg(I) 
		END DO
	
		DO J = 1, 40
			Cdd(I - 1,J)= Cdd(I,J)
			Hdd(I - 1,J)= Hdd(I,J)
		END DO
	END DO 	
	NumRows = NumRecs - 1 
	
END SUBROUTINE FillDNonUni 











! ******************************************************************************
SUBROUTINE Check_Valid_Pathname (CmdLine, R, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Checks for a valid pathname
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       CmdLine
!       ErrorNo 
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       R
!       ErrorNo 
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       Cond2
!       Cond3
!       temp
!       RE
!       rw
!       ios
!       EXISTS
!       TRUE
!       FALSE
!       ----------------------------------------------------------------------------
! ******************************************************************************
	
	intrinsic INDEX, SCAN	
	CHARACTER (LEN=100) :: CmdLine
	INTEGER :: R
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	LOGICAL :: Cond2,Cond3
	INTEGER :: temp
	CHARACTER (LEN=100) :: RE, rw
	INTEGER :: ios
	LOGICAL :: EXISTS,TRUE,FALSE
	temp = SCAN(CmdLine,':')
	TRUE =.TRUE.
	FALSE = .FALSE.
	COND2 = temp .GT. 0
	
	
	! Check whether directory  is valid or not.
	R=1
	ErrorNo=0
					
302 END SUBROUTINE	Check_Valid_Pathname















! ******************************************************************************
SUBROUTINE ParserForInsFile (InLine,Flag, Number, Cht)
! ******************************************************************************
!       PURPOSE:               Parser for the instruction file
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       InLine
!       Flag
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       Number
!       Cht
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Check_For_Chars
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------      
!       INTERNAL VARIABLES:
!       Temp
!       IllChar
!       Cht2
!       ----------------------------------------------------------------------------
! ******************************************************************************
	intrinsic INDEX, TRIM
	
	! Declare Input/Output Variables.
	CHARACTER (LEN=200),INTENT(IN)  :: InLine
	CHARACTER (LEN=200), INTENT(OUT) :: Cht
	INTEGER, INTENT(OUT):: Number
	INTEGER, INTENT(IN) :: Flag
	INTEGER :: IllChar
	CHARACTER (LEN=48) :: Cht2
	
	! Declare Internal Variables.
	CHARACTER (LEN=48) :: Temp
	
	Temp = InLine(INDEX(InLine,'=') + 1:LEN(InLine))
	Cht = TRIM(Temp)
	!Cht = TRIM(InLine(INDEX(InLine,'=') + 1:LEN(InLine)))
	
	IF (Flag == 0) Then
		Cht2 = Cht
		!return a number
		CALL Check_For_Chars(Cht2, IllChar)
		IF (ILLCHAR == 0) THEN
			READ(Cht,"(i4)") Number
		ELSE
			!return -987654321 as indicator of illegal character input
			NUMBER = -987654321
		END IF
	END IF

END SUBROUTINE ParserForInsFile








! ******************************************************************************
SUBROUTINE Get_NumRowsCols (DatFile, NumRows, NumCols, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Get number of rows and columns
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       DatFile
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       NumRows
!       NumCols
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       MaxLineLen
!       MaxNumLine
!       T
!       Status
!       PreviousFlag
!       CurrentFlag
!       I
!       ----------------------------------------------------------------------------
! ******************************************************************************
	
	! Declare Input/Output Variables.
	CHARACTER (LEN=MaxFileName), INTENT(IN) :: DatFile
	INTEGER, INTENT(OUT) :: NumRows
	INTEGER, INTENT(OUT) :: NumCols
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER, PARAMETER :: MaxLineLen = 300
	INTEGER, PARAMETER :: MaxNumLine = 10000
	CHARACTER (LEN = 1) :: T(MaxLineLen)
	INTEGER :: Status
	INTEGER :: PreviousFlag
	INTEGER :: CurrentFlag
	INTEGER :: I
	
	! Find the total number of columns in the 1st line of the input data file.
	NumRows = 0
	NumCols = 0
	Status = 0
	PreviousFlag = 0
	CurrentFlag = 0
	
	
	OPEN(UNIT = 20, FILE = DatFile)
	DO I = 1, MaxLineLen
		READ (20, "(A1)", ADVANCE = "No", IOSTAT = Status) T(I)
		IF (Status /= 0) EXIT 
		PreviousFlag = CurrentFlag
		IF (T(I) == " ") THEN
			CurrentFlag = 0
		ELSE
			CurrentFlag = 1
			IF (PreviousFlag == 0) NumCols = NumCols + 1				
		END IF
	END DO
	!WRITE (*,*) "Total # of columns in input file: ", NumCols
	
	! Find the total number of rows in the input data file.
	REWIND(20)
	DO I = 1, MaxNumLine
		READ (20, *, IOSTAT = Status) T(1)
		IF (Status /= 0) EXIT 
	END DO
	NumRows = I - 1
	!WRITE (*,*) "Total # of rows in input file   :", NumRows
	
	CLOSE(20)
	
END SUBROUTINE Get_NumRowsCols



! ******************************************************************************
SUBROUTINE Read_Data (DatFile, NumRows, NumCols, D,F, ErrorNo,Flag)
! ******************************************************************************
!       PURPOSE:               Read Data
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       DatFile
!       NumRows
!       NumCols
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       D
!       F
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       Status
!       I
!       ----------------------------------------------------------------------------
! ******************************************************************************
	
	! Declare Input/Output Variables.
	CHARACTER (LEN=48), INTENT(IN) :: DatFile
	INTEGER, INTENT(IN) :: NumRows
	INTEGER, INTENT(IN) :: NumCols
	INTEGER             :: Flag
	REAL, INTENT(OUT) :: D(:,:)
	CHARACTER, INTENT(OUT) :: F(:,:)
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: Status
	INTEGER :: I
	
	! Read the input data file and store in matrix D().
	Status = 0
	!WRITE(*,*) "Read Data..."
	OPEN(UNIT = 20, FILE = DatFile)
	DO I = 1, NumRows
		IF (FLAG == 0) THEN
			READ(20, *, IOSTAT = Status) D(I, :)
		ELSE
			READ(20, *, IOSTAT = Status) F(I, :)
		END IF		
	END DO
	CLOSE(20)
	
END SUBROUTINE Read_Data







! ******************************************************************************
SUBROUTINE Fill_XY (GoodRec,D, NumRows, NumXVars, XFld, YFld, GrpFld, GrpVal, X, Y, N, &
	NDFlag,ErrorNo)
! ******************************************************************************
!       PURPOSE:               Fill X and Y fields with variables
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       NumRows
!       NumXVars
!       XFld
!       Yfld
!       GrpFld
!       GrpVal
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       GoodRec
!       D
!       NdFlag
!       X
!       Y
!       N
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       Proceed
!       K1
!       KTot
!       I
!       J
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	!---------------------------------------------------------------------------
	REAL, INTENT(OUT)  :: GoodRec(:)
	REAL, INTENT(OUT)  :: D(:,:)
	INTEGER, INTENT(IN) :: NumRows
	INTEGER, INTENT(IN) :: NumXVars
	INTEGER, INTENT(IN) :: XFld(:)
	INTEGER, INTENT(IN) :: YFld
	INTEGER, INTENT(IN) :: GrpFld
	INTEGER, INTENT(IN) :: GrpVal
	INTEGER, INTENT(OUT):: NDFlag
	REAL, INTENT(OUT) :: X(:,:)
	REAL, INTENT(OUT) :: Y(:,:)
	INTEGER, INTENT(OUT) :: N
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: Proceed
	INTEGER :: K1
	INTEGER :: KTot
	INTEGER :: I, J
	
	!WRITE(*,*) "Fill X & Y Arrays..." 
	DO I = 1, NumRows
		GoodRec(I) = 0
	END DO
	N = 0
	
	DO I = 1, NumRows
	
		! Test the grouping field.
		Proceed = 0
		IF (GrpFld == 0) THEN
			Proceed = 1
		ELSEIF (D(I, GrpFld) == GrpVal) THEN
			Proceed = 1
		END IF
	
		! Test Y(dependent) variables.
		IF ((D(I, YFld) /= NDFlag) .AND. (Proceed == 1)) THEN
	
			! Test X(independent) variable.
			KTot = 0
			DO J = 1, NumXVars
				IF (D(I, XFld(J)) == NDFlag) THEN 
					K1 = 1 
				ELSE
					K1 = 0
				END IF
				KTot = KTot + K1
			END DO
	
			! IF passes GrpFld, YFld and XFld tests, then fill X and Y.
			IF (KTot == 0) THEN
				! Count number of rows in X() and Y().
				N = N + 1
	
				! Fill X() and Y().
				! Fill the first column of X() with value of 1
				X(N, 1) = 1
				DO J = 1, NumXVars
					X(N, J + 1) = D(I, XFld(J))
				END DO
				Y(N, 1) = D(I, YFld)
				GoodRec(I) = 1
			END IF
		END IF
	END DO


END SUBROUTINE Fill_XY








! ******************************************************************************
SUBROUTINE Trans (X, XR, XC, XT, XTR, XTC, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Transpose X matrix
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       XR
!       XC
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       XT
!       XTR
!       XTC
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------      
!       INTERNAL VARIABLES:
!       R                    
!       C
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:, :)
	INTEGER, INTENT(IN) :: XR
	INTEGER, INTENT(IN) :: XC
	REAL, INTENT(OUT) :: XT(:, :)
	INTEGER, INTENT(OUT) :: XTR
	INTEGER, INTENT(OUT) :: XTC
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: R
	INTEGER :: C
	
	! Define total column and row numbers for the transposed matrix XT().
	XTR = XC
	XTC = XR
	
	! Transpose matrix X() to calculate matrix XT().
	DO R = 1, XR
		DO C = 1, XC
			XT(C, R) = X(R, C)
		END DO
	END DO
END SUBROUTINE Trans








!****************************************************************************
SUBROUTINE Mult (MA, MAR, MAC, MB, MBR, MBC, MC, MCR, MCC, ErrorNo)
!******************************************************************************
!       PURPOSE:               Multiply matrix A by matrix B to get matrix C
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       MA
!       MAR
!       MAC
!       MB
!       MBR
!       MBC
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       MC
!       MCR
!       MCC
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------      
!       INTERNAL VARIABLES:
!       I
!       R                    
!       C
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: MA(:, :)
	INTEGER, INTENT(IN) :: MAR
	INTEGER, INTENT(IN) :: MAC
	REAL, INTENT(IN) :: MB(:, :)
	INTEGER, INTENT(IN) :: MBR
	INTEGER, INTENT(IN) :: MBC
	REAL, INTENT(OUT) :: MC(:, :)
	INTEGER, INTENT(OUT) :: MCR
	INTEGER, INTENT(OUT) :: MCC
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: R
	INTEGER :: C
	INTEGER :: I
	
	! Check the numbers of rows and columns.	
	IF (MAC /= MBR) THEN
		WRITE(*,*) ""
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) " Error in Subroutine Mult."
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) "NUM X COLUMNS <> NUM Y ROWS."
		WRITE(*,*) ""
		GO TO 420	! Exit SUBROUTINE Mult
	END IF
	
	! Initialize the values in the matrix C().
	MCR = MAR
	MCC = MBC
	
	DO R = 1, MCR
		DO C = 1, MCC
			MC(R, C) = 0
		END DO
	END DO
	
	! Multiply matrix A() by matrix B() to calculate matrix C().
	DO R = 1, MCR
		DO C = 1, MCC
			DO I = 1, MAC
				MC(R, C) = MC(R, C) + MA(R, I) * MB(I, C)
			END DO
		END DO
	END DO

420 END SUBROUTINE Mult


! ******************************************************************************
SUBROUTINE Invert(A, S, B, Sec, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Invert Matrix
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       A
!       S
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       B
!       Sec
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       DET
!       Big
!       Hold
!       Pivot
!       T
!       NumRows
!       NumCols
!       I
!       J
!       K
!       L
!       M
!       IRow
!       ICol
!       Index
!       ----------------------------------------------------------------------------
! ******************************************************************************
	
	INTRINSIC ABS
	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: A(:, :)
	INTEGER, INTENT(IN) :: S
	REAL, INTENT(OUT) :: B(:, :)
	REAL, INTENT(OUT) :: Sec(:)
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	REAL :: DET
	REAL :: Big
	REAL :: Hold
	REAL :: Pivot
	REAL :: T
	INTEGER :: NumRows
	INTEGER :: NumCols
	INTEGER :: I, J, K, L, M
	INTEGER :: IRow
	INTEGER :: ICol
	INTEGER :: Index(S, 3)
	
	NumRows = S
	NumCols = S
	
	! Transfer A() to B(), and do all future work on B().
	DO I = 1, NumRows
		DO J = 1, NumCols
			B(I, J) = A(I, J)
		END DO
		Index(I, 3) = 0
	END DO
	
	DET = 1
	DO I = 1, NumRows
		! Search for biggest pivot element
		Big = 0
		DO J = 1, NumCols
			IF (Index(J, 3) == 1) GO TO 431
	
			DO K = 1, NumCols
				IF (Index(K, 3) > 1) THEN
					WRITE(*,*) ""
					WRITE(*,*) "-------------------------------"
					WRITE(*,*) " Error in Subroutine Invert."
					WRITE(*,*) "-------------------------------"
					WRITE(*,*) "MATRIX IS SINGULAR."
					WRITE(*,*) ""
					GO TO 439	! Exit SUBROUTINE Invert
				END IF
	
				IF (Index(K, 3) == 1) GO TO 432
	
				IF (Big >= ABS(B(J, K))) GO TO 432
	
				IRow = J
				ICol = K
				Big = ABS(B(J, K))
432			END DO
431		END DO
	
		Index(ICol, 3) = Index(ICol, 3) + 1
		Index(I, 1) = IRow
		Index(I, 2) = ICol
	
		! Interchange rows to put pivot on the diagonal.
		IF (IRow == ICol) GO TO 434
	
		Det = -Det
		DO L = 1, NumCols
			Hold = B(IRow, L)
			B(IRow, L) = B(ICol, L)
			B(ICol, L) = Hold
		END DO
	
		! Divide pivot row by pivot element.
434		Pivot = B(ICol, ICol)
		Det = Det * Pivot
		B(ICol, ICol) = 1
	
		DO L = 1, NumCols
			B(ICol, L) = B(ICol, L) / Pivot
		END DO
	
		! Reduce non-pivot rows.
		DO L = 1, NumCols
			IF (L == ICol) GO TO 435
			T = B(L, ICol)
			B(L, ICol) = 0
			DO M = 1, NumCols
				B(L, M) = B(L, M) - B(ICol, M) * T
			END DO
435		END DO
	END DO
	
	! Interchange Columns.
	DO I = 1, NumCols
		L = NumCols - I + 1
	
		IF (Index(L, 1) == Index(L, 2)) GO TO 436
	
		IRow = Index(L, 1)
		ICol = Index(L, 2)
	
		DO K = 1, NumCols
			Hold = B(K, IRow)
			B(K, IRow) = B(K, ICol)
			B(K, ICol) = Hold
		END DO
436	END DO
	
	DO K = 1, NumCols
		IF (Index(K, 3) /= 1) THEN
			WRITE(*,*) ""
			WRITE(*,*) "-------------------------------"
			WRITE(*,*) " Error in Subroutine Invert."
			WRITE(*,*) "-------------------------------"
			WRITE(*,*) "MATRIX IS SINGULAR."
			WRITE(*,*) ""
			GO TO 439	! Exit SUBROUTINE Invert
		END IF
	END DO
	
	DO I = 1, NumCols
		Sec(I) = B(I, I)
	END DO
	
439 END SUBROUTINE Invert








! ******************************************************************************
SUBROUTINE Reg (X, XR, XC, Y, YR, YC, Beta, BetaR, BetaC, Sec, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Regression
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       XR
!       XC
!       Y
!       YR
!       YC
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       Beta
!       BetaR
!       BetaC
!       Sec
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Trans
!       Mult
!       Invert
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       TempX
!       XT
!       XTX
!       XTX1
!       XTotal
!       Temp
!       XTR
!       XTC
!       XTXR
!       XTXC
!       XTotalR
!       XTotalC
!       NV
!       I
!       J
!       XT1
!       XM
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:, :)
	INTEGER, INTENT(IN) :: XR
	INTEGER, INTENT(IN) :: XC
	REAL, INTENT(IN) :: Y(:, :)
	INTEGER, INTENT(IN) :: YR
	INTEGER, INTENT(IN) :: YC
	REAL, INTENT(OUT) :: Beta(:, :)
	INTEGER, INTENT(OUT) :: BetaR
	INTEGER, INTENT(OUT) :: BetaC
	REAL, INTENT(OUT) :: Sec(:)
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	REAL :: TempX(XR, XC)
	REAL :: XT(XC, XR)
	REAL :: XTX(XC, XC)
	REAL :: XTXI(XC, XC)
	REAL :: XTotal(XC, XR)
	REAL :: Temp
	
	INTEGER :: XTR, XTC
	INTEGER :: XTXR, XTXC
	INTEGER :: XTotalR, XTotalC
	INTEGER :: NV
	INTEGER :: I, J
	
	REAL, ALLOCATABLE :: XT1(:)
	REAL, ALLOCATABLE :: XM(:)
	
	TempX = X
	
	! Call X Means & Normalizes X Variables.
	NV = XC - 1
	ALLOCATE (XT1(NV))
	ALLOCATE (XM(NV))
	
	DO J = 1, NV
		XT1(J) = 0
	END DO
	
	DO I = 1, XR
		DO J = 1, NV
			XT1(J) = XT1(J) + TempX(I, J + 1)
		END DO
	END DO
	
	DO J = 1, NV
		XM(J) = XT1(J) / XR
	
		IF (XM(J) == 0) THEN
			XM(J) = 1
		END IF
	
		DO I = 1, XR
			TempX(I, J + 1) = TempX(I, J + 1) / XM(J)
		END DO
	
	END DO
	
	CALL Trans (TempX, XR, XC, XT, XTR, XTC, ErrorNo)
	CALL Mult (XT, XTR, XTC, TempX, XR, XC, XTX, XTXR, XTXC, ErrorNo)
	CALL Invert (XTX, XTXR, XTXI, Sec, ErrorNo)
	CALL Mult (XTXI, XTXR, XTXC, XT, XTR, XTC, XTotal, XTotalR, XTotalC, &
			ErrorNo)	
	CALL Mult (XTotal, XTotalR, XTotalC, Y, YR, YC, Beta, BetaR, BetaC, ErrorNo)
		
	! Calculate the Coefficients.
	DO J = 1, NV
		Beta(J + 1, 1) = Beta(J + 1, 1) / XM(J)
		Sec(J + 1) = Sec(J + 1) / (XM(J) ** 2)
				
	END DO
	
END SUBROUTINE Reg









! ******************************************************************************
SUBROUTINE Inf(X, XR, XC, Y, YR, YC, Beta, BetaR, BetaC, Sec, Sigma, &
	R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Inf
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       XR
!       XC
!       Y
!       YR
!       YC
!       Beta
!       BetaR
!       BetaC
!       Sec
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       Sigma
!       R2
!       AdjR2
!       RMSE
!       CVRMSE
!       P
!       DW
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Mult
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       YHATR
!       YHATC 
!       I
!       J
!       N
!       NumCoefs
!       NumVars
!       YTot
!       YMean
!       ACNum
!       ACDen
!       DWNum
!       DWDen
!       Prevres
!       AutoCor
!       MSE
!       SSM
!       SSE
!       SSY
!       PNum
!       PDenom
!       XTot
!       YHAT
!       RESX
!       XMean
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:, :)
	INTEGER, INTENT(IN) :: XR
	INTEGER, INTENT(IN) :: XC
	REAL, INTENT(IN) :: Y(:, :)
	INTEGER, INTENT(IN) :: YR
	INTEGER, INTENT(IN) :: YC
	REAL, INTENT(IN) :: Beta(:, :)
	INTEGER, INTENT(IN) :: BetaR
	INTEGER, INTENT(IN) :: BetaC
	REAL, INTENT(IN) :: Sec(:)
	REAL, INTENT(OUT) :: Sigma(:)
	REAL, INTENT(OUT) :: R2
	REAL, INTENT(OUT) :: AdjR2
	REAL, INTENT(OUT) :: RMSE
	REAL, INTENT(OUT) :: CVRMSE
	REAL, INTENT(OUT) :: P
	REAL, INTENT(OUT) :: DW
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: YHATR, YHATC
	INTEGER :: I, J, N
	INTEGER :: NumCoefs, NumVars
	REAL :: YTot
	REAL :: YMean
	REAL :: ACNum, ACDen
	REAL :: DWNum, DWDen
	REAL :: Prevres, AutoCor
	REAL :: MSE
	REAL :: SSM
	REAL :: SSE
	REAL :: SSY
	REAL :: PNum, PDenom
	REAL :: XTot(XC)
	REAL :: YHAT(XR, 1)
	REAL :: RESX(XR)
	REAL, ALLOCATABLE :: XMean(:)
	
	! Definitions.
	N = XR
	NumVars = XC - 1
	NumCoefs = XC
	
	ALLOCATE (XMean(NumCoefs))
	
	! Initialize the values
	YHATR = 0; YHATC = 0
	YTot = 0.0; YMean = 0.0
	ACNum = 0.0; ACDen = 0.0
	DWNum = 0.0; DWDen = 0.0
	Prevres = 0.0; AutoCor = 0.0
	MSE	= 0.0; SSM = 0.0; SSE = 0.0; SSY = 0.0
	PNum = 0.0; PDenom = 0.0
	
	XTot(1:XC) = 0.0
	YHAT(1:XR, 1) = 0.0
	RESX(1:XR) = 0.0
	XMean(1:NumCoefs) = 0.0
	
	! Calculate X & Y Totals and Means.
	DO J = 1, NumVars
		XTot(J) = 0
	END DO
	
	DO I = 1, N
		YTot = YTot + Y(I, 1)
		SSY = SSY + Y(I, 1) ** 2
		DO J = 1, NumVars
			XTot(J) = XTot(J) + X(I, J + 1)
		END DO
	END DO
	
	YMean = YTot / N
	
	DO I = 1, NumVars
		XMean(I) = XTot(I) / N
	END DO
	
	! Calculate SSE, MSE, RMSE, CV-RMSE, & R2.
	YHATR = XR
	YHATC = 1
	CALL Mult (X, XR, XC, Beta, BetaR, BetaC, YHAT, YHATR, YHATC, ErrorNo)
	DO I = 1, N
		! Fill RESX() which corresponds to the matrix X.
		RESX(I) = Y(I, 1) - YHAT(I, 1)
		SSM = SSM + (Y(I, 1) - YMean) ** 2
		SSE = SSE + RESX(I) ** 2
	
		! Calculate AutoCorr and Durbinwatson.
		SELECT CASE (I)
		CASE (1)
		PREVRES = RESX(I)
		CASE DEFAULT
			ACNum = ACNum + Prevres * RESX(I)
			ACDen = ACDen + Prevres ** 2
			DWNum = DWNum + (RESX(I) - Prevres) ** 2
			PNum = PNum + RESX(I) * Prevres
			PDenom = PDenom + RESX(I) ** 2
			Prevres = RESX(I)
		END SELECT
	
		DWDen = DWDen + RESX(I) ** 2
	END DO
	AutoCor = ACNum / ACDen
	DW = DWNum / DWDen
	
	IF ((N - XC) == 0) THEN
		! Same number of data points as reg. coef. gives perfect fit.
		MSE = 0
	ELSE
		MSE = SSE / (N - XC)
	END IF
	
	RMSE = MSE ** 0.5
	CVRMSE = (RMSE / YMean) * 100
	R2 = 1 - (SSE / SSM)
		
	IF (N - XC == 0) THEN
		! Same number of data points as reg. coef. gives perfect fit.
		AdjR2 = 1
	ELSE
		AdjR2 = 1 - ((((N - 1) / (N - XC)) * SSE) / SSM)
	END IF
	P = PNum / PDenom
	
	! Calculate the Standard Error of the Coefficients.
	DO I = 1, NumCoefs
		Sigma(I) = RMSE * Sec(I) ** 0.5
	END DO
END SUBROUTINE Inf







! ******************************************************************************
SUBROUTINE MeanM(X, Y, N, YMean, StdDev, CVStdDev, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Calculate means and standard deviations
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       Y
!       N
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       YMean
!       StdDev
!       CVStdDev
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       I
!       YTotal
!       DevTotal
!       ----------------------------------------------------------------------------
! ******************************************************************************

	INTRINSIC SqRt
	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:,:)
	REAL, INTENT(IN) :: Y(:,:)
	INTEGER, INTENT(IN) :: N
	REAL, INTENT(OUT) :: YMean
	REAL, INTENT(OUT) :: StdDev
	REAL, INTENT(OUT) :: CVStdDev
	INTEGER, INTENT(IN OUT) :: ErrorNo
	! Declare Internal Variables.
	INTEGER :: I
	REAL :: YTotal, DevTotal
	
	! Start the model.
	WRITE(*,*) "Running mean model..."
	
	! Print error if N = 0.
	IF (N == 0) THEN
		WRITE(*,*) ""
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) " Error in Subroutine MeanM"
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) "No data is available to model."
		WRITE(*,*) ""
		GO TO 519		! Exit SUBROUTINE MeanM
	END IF
	
	! Calculate the Ymean.
	YTotal = 0
	DO I = 1, N
		YTotal = YTotal + Y(I,1)
	END DO
	YMean = YTotal / N
	
	! Calculate the Standard Deviation.
	DevTotal = 0
	DO I = 1, N
		DevTotal = DevTotal + (Y(I,1) - YMean) ** 2
	END DO
	StdDev = SqRt(DevTotal / (N - 1))
	
	! Calculate the CV-Standard Deviation.
	CVStdDev = 100 * (StdDev / YMean)
	
519	END SUBROUTINE MeanM











! ******************************************************************************
SUBROUTINE MVR(X, Y, N, NumXVars, Coefs, Sigma, R2, AdjR2, RMSE, CVRMSE, P, &
	DW, ErrorNo)
! ******************************************************************************
!       PURPOSE:               Mvariable Regression
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       Y
!       N
!       NumXVars
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       Coefs
!       Sigma
!       R2
!       AdjR2
!       RMSE
!       CVRMSE
!       P
!       DW
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Reg
!       Inf
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       I
!       BetaR
!       BetaC
!       Beta
!       Sec
!       ----------------------------------------------------------------------------
! ******************************************************************************


	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:, :)
	REAL, INTENT(IN) :: Y(:, :)
	INTEGER, INTENT(IN) :: N
	INTEGER, INTENT(IN) :: NumXVars
	REAL, INTENT(OUT) :: Coefs(:)
	REAL, INTENT(OUT) :: Sigma(:)
	REAL, INTENT(OUT) :: R2
	REAL, INTENT(OUT) :: AdjR2
	REAL, INTENT(OUT) :: RMSE
	REAL, INTENT(OUT) :: CVRMSE
	REAL, INTENT(OUT) :: P
	REAL, INTENT(OUT) :: DW
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: I
	INTEGER :: BetaR, BetaC
	REAL :: Beta(NumXVars + 1, 1)
	REAL :: Sec(NumXVars + 1)
	
	IF (RegType == 2) THEN
		WRITE(*,*) "Running 2P model..."
	ELSE
		WRITE(*,*) "Running MVR model..."
	END IF
	
	! Call regression engine.
	Call Reg(X, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, Sec, ErrorNo)
	Call Inf(X, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, Sec, Sigma, &
		R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
	
	! Display results.
	DO I = 1, NumXVars + 1
		Coefs(I) = Beta(I, 1)
	END DO
END SUBROUTINE MVR












! ******************************************************************************
SUBROUTINE ThreePMVR(X, Y, N, NumXVars, Index, Xcp, SeXcp, Ycp, SeYcp, Slope, &
	SeSlope, R2, AdjR2, RMSE, CVRMSE, P, DW, N1, N2, IVCoefs, SeIVCoefs,ErrorNo)
! ******************************************************************************
!       PURPOSE:               ThreePMVariable Regression
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       Y
!       N
!       NumXVars
!       Index
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       Xcp
!       SeXcp
!       Ycp
!       SeYcp
!       Slope
!       SeSlope
!       R2
!       AdjR2
!       RMSE
!       CVRMSE
!       P
!       DW
!       N1
!       N2
!       IVCoefs
!       SeIVCoefs
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Reg
!       Inf
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       I
!       J
!       K
!       XMin
!       XMax
!       NumInts
!       Inc
!       Itration
!       IndVar
!       BetaR
!       BetaC
!       BestCp
!       Cp
!       RmseMin
!       A
!       Beta
!       Sec
!       Sigma
!       ----------------------------------------------------------------------------
! ******************************************************************************
	
	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:,:)
	REAL, INTENT(IN) :: Y(:,:)
	INTEGER, INTENT(IN) :: N
	INTEGER, INTENT(IN) :: NumXVars
	INTEGER, INTENT(IN) :: Index
	REAL, INTENT(OUT) :: Xcp
	REAL, INTENT(OUT) :: SeXcp
	REAL, INTENT(OUT) :: Ycp
	REAL, INTENT(OUT) :: SeYcp
	REAL, INTENT(OUT) :: Slope
	REAL, INTENT(OUT) :: SeSlope
	REAL, INTENT(OUT) :: R2
	REAL, INTENT(OUT) :: AdjR2
	REAL, INTENT(OUT) :: RMSE
	REAL, INTENT(OUT) :: CVRMSE
	REAL, INTENT(OUT) :: P
	REAL, INTENT(OUT) :: DW
	INTEGER, INTENT(OUT) :: N1
	INTEGER, INTENT(OUT) :: N2
	REAL, INTENT(OUT) :: IVCoefs(:)
	REAL, INTENT(OUT) :: SeIVCoefs(:)
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: I, J, K
	REAL :: XMin = 0, XMax = 0
	INTEGER :: NumInts
	REAL :: Inc
	INTEGER :: Itration
	INTEGER :: IndVar
	INTEGER :: BetaR = 2, BetaC = 1
	REAL :: BestCp = 0
	REAL :: Cp = 0
	REAL :: RmseMin = 0
	REAL :: A(N, NumXVars + 1)
	REAL :: Beta(NumXVars + 1, 1)
	REAL :: Sec(NumXVars + 1)
	REAL :: Sigma(NumXVars + 1)
	BetaR = NumXVars + 1
	BetaC = 1
	
	IF (Index == 0) THEN
		WRITE(*,*) "Running 3P-Cooling model..."
	ELSE
		WRITE(*,*) "Running 3P-Heating model..."
	END IF
	
	! Print error if N = 0.
	IF (N == 0) THEN
		WRITE(*,*) ""
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) " Error in Subroutine ThreePMVR"
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) "No data is available to model."
		WRITE(*,*) ""
		GO TO 639		! Exit SUBROUTINE ThreeP
	END IF
		! Find X Maxs and Mins.
	DO I = 1, N
		IF (I == 1) THEN
			XMin = X(1, 2)
			XMax = X(1, 2)
		END IF
		IF (X(I, 2) < XMin) XMin = X(I, 2)
		IF (X(I, 2) > XMax) XMax = X(I, 2)
	END DO
	
	! Calculate initial size of search grid.
	NumInts = 10
	Inc = (XMax - XMin) / NumInts
	
	! Find Cp using course then fine grid searches.
	DO Itration = 1, 2
		IF (Itration > 1) THEN
			XMin = BestCp - Inc
			Inc = 2 * Inc / NumInts
		END IF
	
		! Try various change points.
		DO I = 1, NumInts - 1
	
			! Initialize counters.
			N1 = 0
			N2 = 0
				! Fill A().
			Cp = XMin + I * Inc
	
			DO J = 1, N
				IF (X(J, 2) <= Cp) THEN
					N1 = N1 + 1
					IF (Index == 0) THEN
						IndVar = 0
					ELSE
						IndVar = 1
					END IF
				ELSE
					N2 = N2 + 1
					IF (Index == 0) THEN
						IndVar = 1
					ELSE
						IndVar = 0
					END IF
				END IF
				A(J, 1) = 1
				A(J, 2) = IndVar * (X(J, 2) - Cp)
	
				DO K = 1, (NumXVars - 1)
					A(J, K+2) = X(J,K+2)
				END DO
			END DO
	
			! Call regression engine.
			Call Reg(A, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, Sec, &
				ErrorNo)
			Call Inf(A, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, Sec, &
				Sigma, R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
	
			! Record Cp with minimum RMSE.
			IF (I == 1) THEN
				RmseMin = RMSE
				BestCp = Cp
			ELSE 
				IF (RMSE < RmseMin) THEN
					RmseMin = RMSE
					BestCp = Cp
				END IF
			END IF
		END DO
	END DO
	
	! Use best Cp to refill A() then rerun regression.
	N1 = 0
	N2 = 0
	Cp = BestCp
	
	DO J = 1, N
		IF (X(J, 2) <= Cp) THEN
			N1 = N1 + 1
			IF (Index == 0) THEN
				IndVar = 0
			ELSE
				IndVar = 1
			END IF
		ELSE
			N2 = N2 + 1
			IF (Index == 0) THEN
				IndVar = 1
			ELSE
				IndVar = 0
			END IF
		END IF
		A(J, 1) = 1
		A(J, 2) = IndVar * (X(J, 2) - Cp)
	
		DO K = 1, (NumXVars - 1)
			A(J,K+2) = X(J, K+2)
		END DO
	END DO
	
	Call Reg(A, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, Sec, ErrorNo)
	Call Inf(A, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, Sec, &
		Sigma, R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
	
	! Set change points and slope.
	! If Index = 0 then 3P Cooling MVR else 3P Heating MVR.
	Xcp = BestCp
	SeXcp = Inc
	Ycp = Beta(1, 1)
	SeYcp = Sigma(1)
	Slope = Beta(2, 1)
	SeSlope = Sigma(2)
	
	DO K = 2, NumXVars
		IvCoefs(K) = Beta(K + 1, 1)
		SeIvCoefs(K) = Sigma( K + 1)
	END DO
	
639	END SUBROUTINE ThreePMVR
















! ******************************************************************************
SUBROUTINE FourPMVR(X, Y, N, NumXVars, Xcp, SeXcp, Ycp, SeYcp, LS, SeLS, RS, &
	SeRS, R2, AdjR2, RMSE, CVRMSE, P, DW, N1, N2, IVCoefs, SeIVCoefs, ErrorNo)
! ******************************************************************************
!       PURPOSE:               FourPMVariable Regression
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       Y
!       N
!       NumXVars
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       Xcp
!       SeXcp
!       Ycp
!       SeYcp
!       LS
!       SeLS
!       RS
!       SeRS
!       R2
!       AdjR2
!       RMSE
!       CVRMSE
!       P
!       DW
!       N1
!       N2
!       IVCoefs
!       SeIVCoefs
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Reg
!       Inf
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       I
!       J 
!       K
!       XMin
!       XMax
!       Xmin4p
!       NumInts
!       Inc
!       Itration
!       IndVar
!       BetaR
!       BetaC
!       BestCp
!       Cp
!       RmseMin
!       A
!       Beta
!       Sec
!       Sigma
!       ----------------------------------------------------------------------------
! ******************************************************************************
	
	INTRINSIC ABS
	
	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:,:)
	REAL, INTENT(IN) :: Y(:,:)
	INTEGER, INTENT(IN) :: N
	INTEGER, INTENT(IN) :: NumXVars
	REAL, INTENT(OUT) :: Xcp
	REAL, INTENT(OUT) :: SeXcp
	REAL, INTENT(OUT) :: Ycp
	REAL, INTENT(OUT) :: SeYcp
	REAL, INTENT(OUT) :: LS
	REAL, INTENT(OUT) :: SeLS
	REAL, INTENT(OUT) :: RS
	REAL, INTENT(OUT) :: SeRS
	REAL, INTENT(OUT) :: R2
	REAL, INTENT(OUT) :: AdjR2
	REAL, INTENT(OUT) :: RMSE
	REAL, INTENT(OUT) :: CVRMSE
	REAL, INTENT(OUT) :: P
	REAL, INTENT(OUT) :: DW
	INTEGER, INTENT(OUT) :: N1
	INTEGER, INTENT(OUT) :: N2
	REAL, INTENT(OUT) :: IVCoefs(:)
	REAL, INTENT(OUT) :: SeIVCoefs(:)
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: I, J, K
	REAL :: XMin = 0.0, XMax = 0.0
	REAL :: XMin4p = 0.0
	INTEGER :: NumInts
	REAL :: Inc
	INTEGER :: Itration
	INTEGER :: IndVar
	INTEGER :: BetaR = 3, BetaC = 1
	REAL :: BestCp = 0
	REAL :: Cp = 0
	REAL :: RmseMin = 0
	REAL :: A(N, NumXVars + 2)
	REAL :: Beta(NumXVars + 2, 1)
	REAL :: Sec(NumXVars + 2)
	REAL :: Sigma(NumXVars + 2)
	BetaR = NumXVars + 2
	BetaC = 1
	WRITE(*,*) "Running 4P Model..."
	
	! Print error if N = 0.
	IF (N == 0) THEN
		WRITE(*,*) ""
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) " Error in Subroutine FourPMVR"
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) "No data is available to model."
		WRITE(*,*) ""
		GO TO 659		! Exit SUBROUTINE FourP
	END IF
	
	! Find X Maxs and Mins.
	DO I = 1, N
		IF (I == 1) THEN
			XMin = X(1, 2)
			XMax = X(1, 2)
		END IF
	
		IF (X(I, 2) < XMin) XMin = X(I, 2)
		IF (X(I, 2) > XMax) XMax = X(I, 2)
	END DO
	
	! Calculate initial size of search grid.
	NumInts = 10
	Inc = (XMax - XMin) / NumInts
	
	! Find Cp using course then fine grid searches.
	DO Itration = 1, 2
	
		! Set XMin4p and Inc depending on course or fine grid search.
		IF (Itration == 1) THEN
			XMin4p = XMin
		ELSE 		! Itration = 2 for fine grid
			XMin4p = BestCp - Inc
			Inc = 2 * Inc / NumInts
		END IF
	
		! Try various change points.
		DO I = 1, NumInts - 1
	
			! Initialize counters.
			N1 = 0
			N2 = 0
	
			! Fill A().
			Cp = XMin4p + I * Inc
	
			DO J = 1, N
				IF (X(J, 2) <= Cp) THEN
					N1 = N1 + 1
					IndVar = 0
				ELSE
					N2 = N2 + 1
					IndVar = 1
				END IF
	
				A(J, 1) = 1
				A(J, 2) = X(J, 2)
				A(J, 3) = IndVar * (X(J, 2) - Cp)
	
				DO K = 1, (NumXVars - 1)
					A(J, 3 + K) = X(J, 2 + K)
				END DO
			END DO
	
			! Call regression engine.
			Call Reg(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, BetaC, Sec, &
				ErrorNo)
			Call Inf(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, BetaC, Sec, &
				Sigma, R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
	
			! Record Cp with minimum RMSE.
			IF (I == 1) THEN
				RmseMin = RMSE
				BestCp = Cp
			ELSE 
				IF (RMSE < RmseMin) THEN
					RmseMin = RMSE
					BestCp = Cp
				END IF
			END IF
		END DO
	END DO

	! Use best Cp to refill A() then rerun regression.
	N1 = 0
	N2 = 0
	Cp = BestCp
	
	DO J = 1, N
		IF (X(J, 2) <= Cp) THEN
			N1 = N1 + 1
			IndVar = 0
		ELSE
			N2 = N2 + 1
			IndVar = 1
		END IF
	
		A(J, 1) = 1
		A(J, 2) = X(J, 2)
		A(J, 3) = IndVar * (X(J, 2) - Cp)
	
		DO K = 1, (NumXVars - 1)
			A(J, 3 + K) = X(J, 2 + K)
		END DO
	END DO
	
	! Call regression engine.
	Call Reg(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, BetaC, Sec, ErrorNo)
	Call Inf(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, BetaC, Sec, Sigma, &
		R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
	
	! Calculate change points and slopes from Beta().
	! ??? yhat = Ycp + LS(T-Xcp)-  +  RS(T-Xcp)+
	Xcp = BestCp
	SeXcp = Inc
	Ycp = Beta(1, 1) + Beta(2, 1) * BestCp
	
	IF ((ABS(Beta(2, 1)) > 0) .AND. (ABS(Xcp) > 0)) THEN
		SeYcp = (Sigma(1) ** 2 + (Beta(2, 1) * Xcp) ** 2 * ((Sigma(2) / &
			Beta(2, 1)) ** 2 + (SeXcp / Xcp) ** 2)) ** 0.5
	ELSE
		SeYcp = SeXcp
	END IF
	
	LS = Beta(2, 1)
	SeLS = Sigma(2)
	RS = Beta(2, 1) + Beta(3, 1)
	SeRS = (Sigma(2) ** 2 + Sigma(3) ** 2) ** 0.5
	
	DO K = 2, numxvars
		IvCoefs(K) = Beta( K + 2, 1)
		SeIvCoefs(K) = Sigma( K + 2)
	END DO
	
659	END SUBROUTINE FourPMVR











! ******************************************************************************
SUBROUTINE FivePMVR(X, Y, N, NumXVars, Xcp1, SeXcp1, Xcp2, SeXcp2, Ycp, SeYcp, &
	LS, SeLS, RS, SeRS, R2, AdjR2, RMSE, CVRMSE, P, DW, IVCoefs, SeIVCoefs, &
	ErrorNo)
! ******************************************************************************
!       PURPOSE:               FivePMVariable Regression
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       X
!       Y
!       N
!       NumXVars
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       Xcp1
!       SeXcp1
!       Xcp2
!       SeXcp2
!       Ycp
!       SeYcp
!       LS
!       SeLS
!       RS
!       SeRS
!       R2
!       AdjR2
!       RMSE
!       CVRMSE
!       P
!       DW
!       IVCoefs
!       SeIVCoefs
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Reg
!       Inf
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------       
!       INTERNAL VARIABLES:
!       I
!       J
!       K
!       M
!       XMin
!       XMax
!       NumInts
!       NumIts
!       GridPass
!       NumLeft
!       NumRight
!       IndVar1
!       IndVar2
!       RmseBest
!       Cp1Best
!       Cp2Best
!       BetaR
!       BetaC
!       Inc
!       A
!       Beta
!       Sec
!       Sigma
!       CPL
!       CPR
!       ----------------------------------------------------------------------------
! ******************************************************************************
	
	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: X(:,:)
	REAL, INTENT(IN) :: Y(:,:)
	INTEGER, INTENT(IN) :: N
	INTEGER, INTENT(IN) :: NumXVars
	REAL, INTENT(OUT) :: Xcp1
	REAL, INTENT(OUT) :: SeXcp1
	REAL, INTENT(OUT) :: Xcp2
	REAL, INTENT(OUT) :: SeXcp2
	REAL, INTENT(OUT) :: Ycp
	REAL, INTENT(OUT) :: SeYcp
	REAL, INTENT(OUT) :: LS
	REAL, INTENT(OUT) :: SeLS
	REAL, INTENT(OUT) :: RS
	REAL, INTENT(OUT) :: SeRS
	REAL, INTENT(OUT) :: R2
	REAL, INTENT(OUT) :: AdjR2
	REAL, INTENT(OUT) :: RMSE
	REAL, INTENT(OUT) :: CVRMSE
	REAL, INTENT(OUT) :: P
	REAL, INTENT(OUT) :: DW
	REAL, INTENT(OUT) :: IVCoefs(:)
	REAL, INTENT(OUT) :: SeIVCoefs(:)
	INTEGER, INTENT(IN OUT) :: ErrorNo
	
	! Declare Internal Variables.
	INTEGER :: I, J, K, M
	REAL :: XMin
	REAL :: XMax
	INTEGER :: NumInts
	INTEGER :: NumIts
	INTEGER :: GridPass
	INTEGER :: NumLeft
	INTEGER :: NumRight
	INTEGER :: IndVar1
	INTEGER :: IndVar2
	REAL :: RmseBest
	REAL :: Cp1Best
	REAL :: Cp2Best
	INTEGER :: BetaR
	INTEGER :: BetaC
	REAL :: Inc				 
	REAL :: A(N, NumXVars + 2)
	REAL :: Beta(NumXVars + 2, 1)
	REAL :: Sec(NumXVars + 2)
	REAL :: Sigma(NumXVars + 2)
	REAL, ALLOCATABLE :: CPL(:)
	REAL, ALLOCATABLE :: CPR(:)
	
	WRITE(*,*) "Running 5P model..."
	
	! Print error if N = 0.
	IF (N == 0) THEN
		WRITE(*,*) ""
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) " Error in Subroutine FivePMVR"
		WRITE(*,*) "-------------------------------"
		WRITE(*,*) "No data is available to model."
		WRITE(*,*) ""
		GO TO 669		! Exit SUBROUTINE FiveP
	END IF
	
	! Dimension arrays.
	BetaR = NumXVars + 2
	BetaC = 1
	
	!  Initializes counting variables
	NumIts = 0
	RmseBest = 0.0
	Cp1Best = 0.0
	Cp2Best = 0.0
	
	! Set number of search intervals.
	NumInts = 9
	ALLOCATE (CPL(NumInts))
	ALLOCATE (CPR(NumInts))
	
	! Find X Maxs and Mins.
	DO I = 1, N
		IF (I == 1) THEN
			XMin = X(1, 2)
			XMax = X(1, 2)
		END IF
	
		IF (X(I, 2) < XMin) XMin = X(I, 2)
		IF (X(I, 2) > XMax) XMax = X(I, 2)
	END DO
	
	! Find best change points using course then fine grid search.
	DO GridPass = 1, 2
	
		! Find change points.
		IF (GridPass == 1) THEN 	! Course (first) grid search
			! Calcualte initial search grid.
			Inc = (XMax - XMin) / NumInts
			NumLeft = NumInts - 1
			NumRight = NumInts - 1
			DO I = 1, NumInts - 1
				CPL(I) = XMin + I * Inc
				CPR(I) = XMin + I * Inc
			END DO
		ELSE  	! Fine grid search
			! Search on either side of Xcp1 and Xcp2.
			NumLeft = 4
			NumRight = 4
			CPL(1) = Cp1Best - 0.666 * Inc
			CPL(2) = Cp1Best - 0.333 * Inc
			CPL(3) = Cp1Best + 0.333 * Inc
			CPL(4) = Cp1Best + 0.666 * Inc
			CPR(1) = Cp2Best - 0.666 * Inc
			CPR(2) = Cp2Best - 0.333 * Inc
			CPR(3) = Cp2Best + 0.333 * Inc
			CPR(4) = Cp2Best + 0.666 * Inc
		END IF
	
		! Try all combinations of change points.
		DO I = 1, NumLeft
			DO J = 1, NumRight
				! Set change points.
				Xcp1 = CPL(I)
				Xcp2 = CPR(J)
	
				! Perform regression.
				IF (Xcp1 < Xcp2) THEN
					NumIts = NumIts + 1
					DO K = 1, N
						IF (X(K, 2) <= Xcp1) THEN
							IndVar1 = 1
						ELSE
							IndVar1 = 0
						END IF
	
						IF (X(K, 2) <= Xcp2) THEN
							IndVar2 = 0
						ELSE
							IndVar2 = 1
						END IF
						A(K, 1) = 1
						A(K, 2) = IndVar1 * (X(K, 2) - Xcp1)
						A(K, 3) = IndVar2 * (X(K, 2) - Xcp2)
	
						DO M = 1, (NumXVars - 1)
							A(k, 3 + M) = X(k, 2 + M)
						END DO
					END DO
	
					Call Reg(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, &
						BetaC, Sec, ErrorNo)
					Call Inf(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, &
						BetaC, Sec, Sigma, R2, AdjR2, RMSE, CVRMSE, &
						P, DW, ErrorNo)
	
					! Select change points which give minimum RMSE.
					IF ((GridPass==1 .AND. NumIts==1) .OR. (RMSE<RmseBest)) THEN
						RmseBest = RMSE
						Cp1Best = Xcp1
						Cp2Best = Xcp2
					END IF
				END IF
			END DO
		END DO
	END DO
	
	! Set final change points equal to best-fit changepoints.
	Xcp1 = Cp1Best
	Xcp2 = Cp2Best
	SeXcp1 = Inc * 0.333
	SeXcp2 = Inc * 0.333
	
	! Fill A() in accordance with Xcp1 and Xcp2.
	DO K = 1, N
		IF (X(K, 2) <= Xcp1) THEN
			IndVar1 = 1
		ELSE
			IndVar1 = 0
		END IF
	
		IF (X(K, 2) <= Xcp2) THEN
			IndVar2 = 0
		ELSE
			IndVar2 = 1
		END IF
	
		A(K, 1) = 1
		A(K, 2) = IndVar1 * (X(K, 2) - Xcp1)
		A(K, 3) = IndVar2 * (X(K, 2) - Xcp2)
	
		DO M = 1, (NumXVars - 1)
			A(J, 3 + M) = X(J, 2 + M)
		END DO
	END DO
	
	! Perform regression with best change points.
	Call Reg(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, BetaC, Sec, ErrorNo)
	Call Inf(A, N, NumXVars + 2, Y, N, 1, Beta, BetaR, BetaC, Sec, Sigma, &
		R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
	
	! Set standard error of coefficents.
	Ycp = Beta(1, 1)
	SeYcp = Sigma(1)
	LS = Beta(2, 1)
	SeLS = Sigma(2)
	RS = Beta(3, 1)
	SeRS = Sigma(3)
	
	DO K = 2, NumXVars
		IvCoefs(K) = Beta(K+2, 1)
		SeIvCoefs(K) = Sigma(K+2)
	END DO
			  
669	END SUBROUTINE FivePMVR





! ******************************************************************************
SUBROUTINE VBDD(D,NumRows,YFld,GrpFld,GrpVal,NDFlag,Dds,N,Base,Coefs,Sigma,R2,ADJR2,RMSE,CVRMSE,P,DW,GoodRec)
! ******************************************************************************
!       PURPOSE:               VBDD
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       D
!       NumRows
!       Yfld
!       GrpFld
!       GrpVal
!       NDFlag
!       Dds
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       N
!       Base
!       Coefs
!       Sigma
!       R2
!       ADJR2
!       RMSE
!       CVRMSE
!       P
!       DW
!       GoodRec
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       Reg
!       Inf
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------      
!       INTERNAL VARIABLES:
!       I
!       NumXVars
!       BestBase
!       Proceed
!       BetaR
!       BetaC
!       R2Best
!       X
!       Y
!       Beta
!       Sec
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	REAL, INTENT(IN) :: D(:,:)        
	INTEGER, INTENT(IN) :: NumRows
	INTEGER, INTENT(IN) :: YFld
	INTEGER, INTENT(IN) :: GrpFld
	INTEGER, INTENT(IN) :: GrpVal
	INTEGER, INTENT(IN) :: NDFlag
	REAL, INTENT(IN) :: Dds(:,:)
	INTEGER, INTENT(OUT) :: N 
	INTEGER, INTENT(OUT) :: Base
	REAL, INTENT(OUT) :: Coefs(:)
	REAL, INTENT(OUT) :: Sigma(:)
	REAL, INTENT(OUT) :: R2
	REAL, INTENT(OUT) :: ADJR2
	REAL, INTENT(OUT) :: RMSE
	REAL, INTENT(OUT) :: CVRMSE        
	REAL, INTENT(OUT) :: P
	REAL, INTENT(OUT) :: DW
	REAL, INTENT(OUT) :: GoodRec(:)
	
	! Declare Internal Variables.	
	INTEGER :: I
	INTEGER :: NumXVars
	INTEGER :: BestBase
	INTEGER :: Proceed
	INTEGER :: BetaR
	INTEGER :: BetaC
	REAL :: R2Best
	REAL, ALLOCATABLE :: X(:,:)
	REAL, ALLOCATABLE :: Y(:,:)
	REAL :: Beta(2, 1)
	REAL :: Sec(2)
	
	
	WRITE(*,*) "Running VBDD model..."
	
	
	! Counts N to Allocate X() and Y()
	N = 0
	BASE = 1
	DO I = 1, NumRows
		Proceed = 0
		IF ((GrpFld == 0 ) .OR. (D(I,GrpFld) == GrpVal )) THEN
			Proceed = 1
		END IF
	
		IF ((Dds(I, Base) /= NdFlag).AND.(D(I,YFld) /= NDFlag).AND.(Proceed ==1)) THEN
			N = N + 1
		END IF
	END DO 
	
	! Allocate X and Y
	NumXVars = 1
	ALLOCATE(X(N,NumXVars + 1))
	ALLOCATE(Y(N,1))
	
	! Search for best dd base
	DO Base = 1,40
		! Fill X(),Y(), and Calc N		
		N = 0
		DO I = 1, NumRows
	
			!Checks grpfld
			Proceed = 0
			IF ((GrpFld == 0 ) .OR. (D(I,GrpFld) == GrpVal )) Proceed = 1
				! Fills X(),Y(), and Calcs N
				IF ((Dds(I, Base) /= NdFlag).AND.(D(I,YFld) /= NDFlag).AND.(Proceed ==1)) THEN
				N = N + 1
				X(N,1) = 1
				X(N,2) = Dds(I, Base)
				Y(N,1) = D(I, YFld)
			END IF
		END DO
	
		!Call regression engine.
		Call Reg(X, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, &
			Sec, ErrorNo)
		Call Inf(X, N, NumXVars + 1, Y, N, 1, Beta, BetaR, BetaC, &
			Sec, Sigma, R2, AdjR2, RMSE, CVRMSE, P, DW, ErrorNo)
	
		! Test  for Best base temp
		IF (Base == 1) THEN
			R2Best = R2
			BestBase = 1
		ELSE IF (R2 > R2Best) THEN
			R2Best = R2
			BestBase = Base
		END IF
	
	END DO	
	Base = BestBase
	
	! FILL X(), Y(), and N with Best Base Dds
	N = 0
	DO I = 1,NumRows
		GOODREC(I) = 0
		!TESTS GRPFLD
		PROCEED = 0
		IF ((GrpFld == 0 ) .OR. (D(I,GrpFld) == GrpVal)) Proceed = 1
	
		!FILLS X(), Y(), and N with Best Base Dds         
		IF ((Dds(I, Base) /= NDFlag).AND.(D(I,YFld) /= NDFlag).AND.(Proceed == 1)) THEN
			N = N + 1
			X(N,1) = 1
			X(N,2) = Dds(I,Base)
			Y(N,1) = D(I,YFld)
			GoodRec(I) = 1
		END IF
	END DO
	
	! Run 2p Model with best base Dds	
	CALL Reg(X,N,NumXVars + 1,Y,N,1,Beta,BetaR,BetaC,Sec,ErrorNo)
	CALL Inf(X,N,NumXVars + 1,Y,N,1,Beta,BetaR,BetaC,Sec,Sigma,R2,AdjR2,RMSE,CVRMSE,&
		P,DW,ErrorNo)
	
	DO I = 1,BetaR
		Coefs(I) = Beta(I,1)
	END DO
	
END SUBROUTINE VBDD






! ******************************************************************************
SUBROUTINE Create_Out_File (OutFile,ResFile,RegType,ResidMode, Version,ErrorNo)
! ******************************************************************************
!       PURPOSE:               Create an output file
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       OutFile
!       ResFile
!       RegType
!       ResidMode
!       Version
!       ErrorNo
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------
!       INTERNAL VARIABLES:
!       I
!       J
!       RegTypeText
!       ErrorInfo
!       test
!       YPred
!       Res
!       Temp1
!       IVar
!       Index
!       IVar1
!       IVar2
!       ----------------------------------------------------------------------------      
! ******************************************************************************

	! Declare Input/Output Variables.
	CHARACTER (LEN=MaxFileName), INTENT(IN) :: OutFile
	CHARACTER (LEN=MaxFileName), INTENT(IN) :: ResFile
	INTEGER, INTENT(IN) :: RegType
	INTEGER, INTENT(IN) :: ResidMode	
	INTEGER, INTENT(IN OUT) :: ErrorNo
	CHARACTER(LEN=60), ALLOCATABLE :: F(:,:)
	REAL, INTENT(IN) :: Version
	
	! Declare Internal Variables.
	INTEGER :: I,J
	CHARACTER (LEN=30) :: RegTypeText
	CHARACTER (LEN=MaxFileName) :: ErrorInfo
	CHARACTER (LEN=MaxFileName) :: test	
	REAL :: YPred
	REAL :: Res
	REAL :: Temp1
	REAL :: B1, B2, B3	
	INTEGER :: Temp
	INTEGER :: IVar
	INTEGER :: Index
	INTEGER :: IVar1, IVar2
	CHARACTER (LEN=2) :: path='./'
	! test for errors, if so, go to end of subroutine
	If (ErrorNo /= 0) GO TO 909
	
	! Open output file.
	!WRITE(*,*) "Create Output File..."
	OPEN(UNIT = 90, FILE = path//OutFile)
	
	! Print Regression Result.	
	SELECT CASE (RegType)
	CASE (1)	
		RegTypeText = "Mean"
	CASE (2)	
		RegTypeText = "2P"
	CASE (3)	
		Index = 0
		IF(NumXVars == 1) THEN
			RegTypeText = "3P Cooling"
		ELSE 
			RegTypeText = "3P Cooling MVR"
		END IF
	CASE (4)
		Index = 1
		IF(NumXVars == 1) THEN
			RegTypeText = "3P Heating"
		ELSE 
			RegTypeText = "3P Heating MVR"
		END IF
	CASE (5)
		IF(NumXVars == 1) THEN
			RegTypeText = "4P"
		ELSE 
			RegTypeText = "4P MVR"
		END IF
	CASE (6)	
		IF(NumXVars == 1) THEN
			RegTypeText = "5P"
		ELSE 
			RegTypeText = "5P MVR"
		END IF
	CASE (7)	
		RegTypeText = "MVR"
	CASE (8)	
		RegTypeText = "HDD"
	CASE (9)	
		RegTypeText = "CDD" 
	END SELECT
	
	
	! Print Input Instruction.	
	WRITE(90,*) "********************************************"
	WRITE(90,"(A35, F3.1,A1)") "  ASHRAE INVERSE MODELING TOOLKIT (",Version,")" 
	WRITE(90,*) "********************************************"
	WRITE(90,*) "   Output file name = ", OutFile
	WRITE(90,*) "********************************************"
	WRITE(90,"(4X, A23, A48)") "Input data file name = ", DatFile
	WRITE(90,"(4X, A23, A24)") "Model type =           ", RegTypeText
	!WRITE(90,"(4X, A23, I2)")  "Weight column No =     ", WeightFld
	WRITE(90,"(4X, A23, I2)")  "Grouping column No =   ", GrpFld
	WRITE(90,"(4X, A23, I2)")  "Value for grouping =   ", GrpVal
	WRITE(90,"(4X, A23, I2)")  "Residual mode =        ", ResidMode
	WRITE(90,"(4X, A23, I2)")  "# of X(Indep.) Var =   ", NumXVars
	WRITE(90,"(4X, A23, I2)")  "Y1 column number =     ", YFld
	DO I = 1, 6
		IF (I <= NumXVars) THEN
			WRITE(90,"(4X, A1, I1, A18, I2)") "X", I, &
				" column number =   ", XFld(I)
		ELSE
			WRITE(90,"(4X, A1, I1, A29)")  "X", I, &
				" column number =   0 (unused)"
		END IF
	END DO	
	If (ErrorNo /= 0) GO TO 909
	
	! print regression results
	WRITE(90,*) "********************************************"
	WRITE(90,*) "   Regression Results"
	WRITE(90,*) "  --------------------------------------"
	WRITE(90,"(4X, A10, I7)") "N =", N
	WRITE(90,*) "  --------------------------------------"
	IF (REGTYPE /= 1) THEN
		WRITE(90,"(4X, A10, F10.3, A2)") "R2 =", R2
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F10.3)") "AdjR2 =", AdjR2
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4)") "RMSE =", RMSE
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F10.3, A1)") "CV-RMSE =", CVRMSE, "%"
		WRITE(90,*) "  --------------------------------------"           
		WRITE(90,"(4X, A10, F10.3)") "p =", P
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F10.3, A6)") "DW =", DW, " (p>0)"
		WRITE(90,*) "  --------------------------------------"
	END IF 
	
	
	SELECT CASE (RegType)	
	CASE (1)	! Mean Model
		WRITE(90,"(4X, A10, F10.3)") "Ymean =", YMean
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F10.3)") "StdDev =", StdDev
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F10.3,A2)") "CV-StDev =", CVStdDev,"%"
		WRITE(90,*) "  --------------------------------------"
	
	CASE (2)	! 2P Model
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "a =", Coefs(1), &
			" (", Sigma(1), ")"
		WRITE(90,*) "  --------------------------------------"
		DO I = 1, NumXVars
			WRITE(90,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
				" =", Coefs(I + 1), " (", Sigma(I + 1), ")"
			WRITE(90,*) "  --------------------------------------"
		END DO
	
	CASE (3)	! 3P Cooling (or 3PC MVR) Model		
		WRITE(90,"(4X, A10, I7)") "N1 =", N1
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, I7)") "N2 =", N2
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", 0.0, &
			" (", 0.0, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", Slope, &
			" (", SeSlope, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp =", Xcp, &
			" (", SeXcp, ")"
		WRITE(90,*) "  --------------------------------------"			
		DO I=2, NumXVars
			WRITE(90,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
			" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(90,*) "  ---------------------------------"
		
	CASE (4)	! 3P Heating ( or 3PH MVR) Model
		WRITE(90,"(4X, A10, I7)") "N1 =", N1
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, I7)") "N2 =", N2
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", Slope, &
			" (", SeSlope, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", 0.0, &
			" (", 0.0, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp =", Xcp, &
			" (", SeXcp, ")"
		WRITE(90,*) "  --------------------------------------"
		DO I=2, NumXVars
			WRITE(90,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
			" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(90,*) "  ---------------------------------"
		
		
	CASE (5)	! 4P (or 4P MVR) Model
		WRITE(90,"(4X, A10, I7)") "N1 =", N1
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, I7)") "N2 =", N2
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", LS, &
			" (", SeLS, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", RS, &
			" (", SeRS, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp =", Xcp, &
			" (", SeXcp, ")"
		WRITE(90,*) "  --------------------------------------"
		DO I=2, NumXVars
			WRITE(90,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
			" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(90,*) "  ---------------------------------"
	
	CASE (6)	! 5P (or 5P MVR) Model
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp1 =", Xcp1, &
			" (", SeXcp1, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp2 =", Xcp2, &
			" (", SeXcp2, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", LS, &
			" (", SeLS, ")"
		WRITE(90,*) "  --------------------------------------"
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", RS, &
			" (", SeRS, ")"
		WRITE(90,*) "  --------------------------------------"
		DO I=2, NumXVars
			WRITE(90,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
			" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(90,*) "  ---------------------------------"
	
	CASE (7)	! MVR Model			
		WRITE(90,"(4X, A10, F12.4, A2, F12.4, A1)") "a =", Coefs(1), &
			" (", Sigma(1), ")"
		WRITE(90,*) "  --------------------------------------"
		DO I = 1, NumXVars
			WRITE(90,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
				" =", Coefs(I + 1), " (", Sigma(I + 1), ")"
			WRITE(90,*) "  --------------------------------------"
		END DO
	
	CASE (8)        !HDD Model
		WRITE(90,"(4X,A10,I7)")  "DD Base = ", Base+40
		WRITE(90,*) "  --------------------------------------" 
		WRITE(90,"(4X,A10,F10.4,A2,F12.4,A1)") "a = ",Coefs(1),"(",&
			Sigma(1),")"
		WRITE(90,*) "  --------------------------------------" 
		WRITE(90,"(4X,A10,F10.4,A2,F12.4,A1)") "X1 =",Coefs(2),"(",&
			Sigma(2),")"
		WRITE(90,*) "  --------------------------------------"
	
	CASE (9)        !CDD Model
		WRITE(90,"(4X,A10,I7)")  "DD Base = ", Base+40
		WRITE(90,*) "  --------------------------------------" 
		WRITE(90,"(4X,A10,F10.4,A2,F12.4,A1)") "A = ",Coefs(1),"(",&
			Sigma(1),")"
		WRITE(90,*) "  --------------------------------------" 
		WRITE(90,"(4X,A10,F10.4,A2,F12.4,A1)") "X1 =",Coefs(2),"(",&
			Sigma(2),")"
		WRITE(90,*) "  --------------------------------------"
	
	
	END SELECT
	CLOSE(90)
	
	! Print Information about Residual File.
	IF (ResidMode == 1) THEN	
		OPEN(UNIT = 99, FILE = path//ResFile)
	
		If (ErrorNo /= 0) GO TO 909
	
		SELECT CASE (RegType)
		CASE (1)	
			DO I = 1, NumRows				
				IF (GoodRec(I) == 1) THEN				
					YPred = YMean
					Res = D(I,YFld) - YPred	
					DO J = 1, NumCols
						Temp = D(I,J)
						IF ((J == 6).OR.(J== 7)) THEN
							WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
						ELSE	
							WRITE(99,'(I5)',advance="no") Temp
						END IF
					END DO
					WRITE(99,"( 1X,F9.2,1X,F9.2)")  YPred,Res
				END IF
			END DO						
	
		CASE (2)      	
			DO I = 1, NumRows
				IF (GoodRec(I) == 1)THEN
					YPred = Coefs(1) + (Coefs(2) * D(I,Xfld(1)))
					Res = D(I,YFld) - YPred
	
					!Print Ypred and Res
					DO J=1, NumCols
						Temp = D(I,J)
						IF ((J == 6).OR.(J== 7)) THEN
							WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
						ELSE	
							WRITE(99,'(I5)',advance="no") Temp
						END IF
					END DO
					WRITE(99,"( 1X,F9.2,1X,F9.2)") YPred,Res
				END IF
			END DO						
			
		CASE (3,4)	
			DO I = 1, NumRows
				IF (GoodRec(I) == 1) THEN
					IF(Index == 0) THEN
						IF (D(I,Xfld(1)) <= Xcp ) THEN
							IVar = 0
						ELSE
							IVar = 1
						END IF
					ELSE			
					 	IF (D(I,Xfld(1))<= Xcp ) THEN
							IVar = 1
						ELSE
							IVar = 0
						END IF
					END IF			
														
					YPred = Ycp + Slope * (D(I,Xfld(1)) - Xcp) * Ivar
					DO J = 2 , NumXVars
						YPred = Ypred + IvCoefs(J) * D(I,Xfld(J))
					END DO
					Res =  D(I,YFld) - YPred	
		
					DO J = 1, NumCols
						WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
					END DO
					WRITE(99,"(1X,F9.2,1X,F9.2)") YPred,Res
				END IF
			END DO
	
		CASE (5)	
			B2 = Ls
			B1 = Ycp - B2 * Xcp
			B3 = Rs - B2			
			DO I = 1, NumRows			
				IF (GoodRec(I) == 1) THEN
					!Set Ivar
					IF (D(I,Xfld(1)) <= Xcp) THEN
						IVar = 0
					ELSE 
						IVar = 1
					END IF
	
					!Calc Ypred and res	
					YPred = B1 + (B2 * D(I,Xfld(1))) + (B3 * (D(I,Xfld(1))- Xcp) * IVar)	
					DO J = 2, NumXVars
						YPred = Ypred + IVCoefs(J) * D(I,Xfld(J))
					END DO
					Res = D(I,YFld) - YPred
	
					!Print Flds in D(), then ypred and res			
					DO J = 1, NumCols
						WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
					END DO
					WRITE(99,"(1X,F9.2,1X,F9.2)")YPred,Res
				END IF
			END DO	
	
		CASE (6)	
			DO I = 1, NumRows
						
				IF (GoodRec(I) == 1) THEN
					!Calc Ypred and res	
					IF (D(I,Xfld(1)) <= Xcp1) THEN
						IVar1 = 1
					ELSE 
						IVar1 = 0
					END IF
					
					IF (D(I,Xfld(1)) <= Xcp2) THEN
						IVar2 = 0
					ELSE 
						IVar2 = 1
					END IF
					
					YPred = Ycp + Ls * (D(I,Xfld(1)) -Xcp1) * IVar1 + Rs*(D(I,Xfld(1)) - Xcp2) * IVar2
					DO J = 2, NumXVars
						YPred = YPred + IVCoefs(J) * D(I,Xfld(J))
					END DO
					Res = D(I,YFld) - YPred
						
					!Print Fld in D()
					DO J = 1, NumCols 
						WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
					END DO
					WRITE(99,"(1X,F9.2,1X,F9.2)")YPred,Res
				END IF
			END DO 
	
		CASE (7)	
			RegTypeText = "MVR"
			Do I = 1 , NumRows
				IF (GoodRec(I) == 1) THEN
					YPred = Coefs(1)
					DO J = 1, NumXVars
						YPred = Ypred + Coefs(J+1) * D(I, Xfld(J))
					END DO
					Res = D(I,YFld) - YPred
					DO J = 1, NumCols
					WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
					END DO
					WRITE(99,"(1X,F9.2,1X,F9.2)")YPred,Res
				END IF
			END DO
	
		CASE (8)	
			RegTypeText = "Hdd"
			DO I = 1, NumRows
				IF (GoodRec(I) == 1) THEN
					YPred = coefs(1) + coefs(2) * Hdd(I,Base)
					Res = D(I,YFld) - YPred
					DO J=1, NumCols
						WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
					END DO
					WRITE(99,"(1X,F9.2,1X,F9.2,1X,F9.2)") HDD(I,Base),YPred,Res
				END IF
			END DO
	
		CASE (9)	
			RegTypeText = "Cdd"
			DO I = 1, NumRows
				IF (GoodRec(I) == 1) THEN
					YPred = coefs(1) + coefs(2) * Cdd(I,Base)
					Res = D(I,YFld) - Ypred	
					DO J=1, NumCols
						WRITE(99,'(1X,F9.2)',advance="no") D(I,J)
					END DO
					WRITE(99,"(1X,F9.2,1X,F9.2,1X,F9.2)") CDD(I,Base),YPred,Res
				END IF
			END DO
	
		END SELECT
	END IF
CLOSE(99)
	
!WRITE(*,*) "Process Done!"
	!WRITE(*,*) "No Error!"
	
	GO TO 2201
	
909	WRITE(*,*)" Error No.:", ErrorNo
	!ALLOCATE (F(999, 2))
	!ErrorInfo = "esave.eri"
	!CALL Read_Info(ErrorInfo,999,2,F,ErrorNo)
	! I is the number of the line of esave.eri
	!DO I = 1, 5
	!        Read(F(I,1),"(i3)") Temp
	!        IF (Temp == ErrorNo ) THEN
	!                WRITE(*,*)" Error No.:", ErrorNo, F(I,2) 
	!        END IF
	!END DO
	
	
2201 END SUBROUTINE Create_Out_File








! ******************************************************************************
SUBROUTINE Create_Screen_Output (OutFile,ResFile,RegType,ResidMode, Version,ErrorNo)
! ******************************************************************************
!       PURPOSE:               Creates screen output
!       ----------------------------------------------------------------------------
!       INPUT VARIABLES:
!       OutFile
!       ResFile
!       RegType
!       ResidMode
!       ErrorNo
!       Version
!       ----------------------------------------------------------------------------
!       OUTPUT VARIABLES:
!       ErrorNo
!       ----------------------------------------------------------------------------
!       SUBROUTINES CALLED:
!       None
!       ----------------------------------------------------------------------------
!       FUNCTIONS CALLED:	
!       None
!       ----------------------------------------------------------------------------      
!       INTERNAL VARIABLES:
!       I
!       J
!       RegTypeText
!       ErrorInfo
!       test
!       Ypred
!       Res
!       Temp1
!       IVar
!       Index
!       IVar1
!       IVar2
!       ----------------------------------------------------------------------------
! ******************************************************************************

	! Declare Input/Output Variables.
	CHARACTER (LEN=MaxFileName), INTENT(IN) :: OutFile
	CHARACTER (LEN=MaxFileName), INTENT(IN) :: ResFile
	INTEGER, INTENT(IN) :: RegType
	INTEGER, INTENT(IN) :: ResidMode	
	INTEGER, INTENT(IN OUT) :: ErrorNo
	CHARACTER(LEN=60), ALLOCATABLE :: F(:,:)
	REAL, INTENT(IN) :: Version
	
	! Declare Internal Variables.
	INTEGER :: I,J
	CHARACTER (LEN=30) :: RegTypeText
	CHARACTER (LEN=MaxFileName) :: ErrorInfo
	CHARACTER (LEN=MaxFileName) :: test	
	REAL :: YPred
	REAL :: Res
	REAL :: Temp1
	REAL :: B1, B2, B3	
	INTEGER :: Temp
	INTEGER :: IVar
	INTEGER :: Index
	INTEGER :: IVar1, IVar2
	CHARACTER (LEN=40) :: path=''
	
	! test for errors, if so, go to end of subroutine
	If (ErrorNo /= 0) GO TO 909
	
	
	! Open output file.
	!WRITE(*,*) "Create Output File..."
	!OPEN(UNIT = 90, FILE = path//OutFile)
	
	! Print Regression Result.	
	SELECT CASE (RegType)
	CASE (1)	
			RegTypeText = "Mean"
	CASE (2)      	
			RegTypeText = "2P"
	CASE (3)	
			Index = 0
			IF(NumXVars == 1) THEN
				RegTypeText = "3P Cooling"				
			ELSE 
				RegTypeText = "3P Cooling MVR"
			END IF
	CASE (4)	
			Index = 1
			IF(NumXVars == 1) THEN
				RegTypeText = "3P Heating"				
			ELSE 
				RegTypeText = "3P Heating MVR"
			END IF					
	CASE (5)				
			IF(NumXVars == 1) THEN
				RegTypeText = "4P"
			ELSE 
				RegTypeText = "4P MVR"
			END IF					
	CASE (6)	
			IF(NumXVars == 1) THEN
				RegTypeText = "5P"
			ELSE 
				RegTypeText = "5P MVR"
			END IF				
	CASE (7)	
			RegTypeText = "MVR"
	CASE (8)	
			RegTypeText = "HDD"
	CASE (9)	
			RegTypeText = "CDD" 
	END SELECT
	
	
	! Print Input Instruction.	
	WRITE(*,*) "********************************************"
	WRITE(*,"(A35, F3.1,A1)") "  ASHRAE INVERSE MODELING TOOLKIT (",Version,")" 
	WRITE(*,*) "********************************************"
	WRITE(*,*) "   Output file name = ", OutFile
	WRITE(*,*) "********************************************"
	WRITE(*,"(4X, A23, A48)") "Input data file name = ", DatFile
	WRITE(*,"(4X, A23, A24)") "Model type =           ", RegTypeText
	!WRITE(*,"(4X, A23, I2)")  "Weight column No =     ", WeightFld
	WRITE(*,"(4X, A23, I2)")  "Grouping column No =   ", GrpFld
	WRITE(*,"(4X, A23, I2)")  "Value for grouping =   ", GrpVal
	WRITE(*,"(4X, A23, I2)")  "Residual mode =        ", ResidMode
	WRITE(*,"(4X, A23, I2)")  "# of X(Indep.) Var =   ", NumXVars
	WRITE(*,"(4X, A23, I2)")  "Y1 column number =     ", YFld
	DO I = 1, 6
		IF (I <= NumXVars) THEN
			WRITE(*,"(4X, A1, I1, A18, I2)") "X", I, &
				" column number =   ", XFld(I)
		ELSE
			WRITE(*,"(4X, A1, I1, A29)")  "X", I, &
				" column number =   0 (unused)"
		END IF
	END DO	
	If (ErrorNo /= 0) GO TO 909
	
	
	!print regression results
	WRITE(*,*) "********************************************"
	WRITE(*,*) "   Regression Results"
	WRITE(*,*) "  --------------------------------------"
	WRITE(*,"(4X, A10, I7)") "N =", N
	WRITE(*,*) "  --------------------------------------"
	IF (REGTYPE /= 1) THEN
	WRITE(*,"(4X, A10, F10.3, A2)") "R2 =", R2
	WRITE(*,*) "  --------------------------------------"
	WRITE(*,"(4X, A10, F10.3)") "AdjR2 =", AdjR2
	WRITE(*,*) "  --------------------------------------"
	WRITE(*,"(4X, A10, F12.4)") "RMSE =", RMSE
	WRITE(*,*) "  --------------------------------------"
	WRITE(*,"(4X, A10, F10.3, A1)") "CV-RMSE =", CVRMSE, "%"
	WRITE(*,*) "  --------------------------------------"           
	WRITE(*,"(4X, A10, F10.3)") "p =", P
	WRITE(*,*) "  --------------------------------------"
	WRITE(*,"(4X, A10, F10.3, A6)") "DW =", DW, " (p>0)"
	WRITE(*,*) "  --------------------------------------"
	END IF 
	
	
	SELECT CASE (RegType)	
	
	CASE (1)	! Mean Model
		WRITE(*,"(4X, A10, F10.3)") "Ymean =", YMean
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F10.3)") "StdDev =", StdDev
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F10.3,A2)") "CV-StDev =", CVStdDev,"%"
		WRITE(*,*) "  --------------------------------------"
	
	CASE (2)	! 2P Model
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "a =", Coefs(1), &
			" (", Sigma(1), ")"
		WRITE(*,*) "  --------------------------------------"
		DO I = 1, NumXVars
			WRITE(*,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
				" =", Coefs(I + 1), " (", Sigma(I + 1), ")"
			WRITE(*,*) "  --------------------------------------"
		END DO
	
	CASE (3)	! 3P Cooling (or 3PC MVR) Model		
		WRITE(*,"(4X, A10, I7)") "N1 =", N1
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, I7)") "N2 =", N2
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", 0.0, &
			" (", 0.0, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", Slope, &
			" (", SeSlope, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp =", Xcp, &
			" (", SeXcp, ")"
		WRITE(*,*) "  --------------------------------------"           
		DO I=2, NumXVars
			WRITE(*,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
				" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(*,*) "  ---------------------------------"
		
	CASE (4)	! 3P Heating ( or 3PH MVR) Model
		WRITE(*,"(4X, A10, I7)") "N1 =", N1
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, I7)") "N2 =", N2
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", Slope, &
			" (", SeSlope, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", 0.0, &
			" (", 0.0, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp =", Xcp, &
			" (", SeXcp, ")"
		WRITE(*,*) "  --------------------------------------"
		DO I=2, NumXVars
			WRITE(*,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
			" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(*,*) "  ---------------------------------"
		
	CASE (5)	! 4P (or 4P MVR) Model
		WRITE(*,"(4X, A10, I7)") "N1 =", N1
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, I7)") "N2 =", N2
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", LS, &
			" (", SeLS, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", RS, &
			" (", SeRS, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp =", Xcp, &
			" (", SeXcp, ")"
		WRITE(*,*) "  --------------------------------------"
		DO I=2, NumXVars
		WRITE(*,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
			" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(*,*) "  ---------------------------------"
	
	CASE (6)	! 5P (or 5P MVR) Model
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp1 =", Xcp1, &
			" (", SeXcp1, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Xcp2 =", Xcp2, &
			" (", SeXcp2, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "Ycp =", Ycp, &
			" (", SeYcp, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "LS =", LS, &
			" (", SeLS, ")"
		WRITE(*,*) "  --------------------------------------"
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "RS =", RS, &
			" (", SeRS, ")"
		WRITE(*,*) "  --------------------------------------"
		DO I=2, NumXVars
			WRITE(*,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
			" =", IVCoefs(I) , " (", SeIVCoefs(I), ")"
		END DO
		WRITE(*,*) "  ---------------------------------"
	
	CASE (7)	! MVR Model			
		WRITE(*,"(4X, A10, F12.4, A2, F12.4, A1)") "a =", Coefs(1), &
			" (", Sigma(1), ")"
		WRITE(*,*) "  --------------------------------------"
		DO I = 1, NumXVars
			WRITE(*,"(4X, A7, I1, A2, F12.4, A2, F12.4, A1)") "X", I, &
				" =", Coefs(I + 1), " (", Sigma(I + 1), ")"
			WRITE(*,*) "  --------------------------------------"
		END DO
	
	CASE (8)        !HDD Model
		WRITE(*,"(4X,A10,I7)")  "DD Base = ", Base+40
		WRITE(*,*) "  --------------------------------------" 
		WRITE(*,"(4X,A10,F10.4,A2,F12.4,A1)") "a = ",Coefs(1),"(",&
			Sigma(1),")"
		WRITE(*,*) "  --------------------------------------" 
		WRITE(*,"(4X,A10,F10.4,A2,F12.4,A1)") "X1 =",Coefs(2),"(",&
			Sigma(2),")"
		WRITE(*,*) "  --------------------------------------"
		
	CASE (9)        !CDD Model
		WRITE(*,"(4X,A10,I7)")  "DD Base = ", Base+40
		WRITE(*,*) "  --------------------------------------" 
		WRITE(*,"(4X,A10,F10.4,A2,F12.4,A1)") "A = ",Coefs(1),"(",&
			Sigma(1),")"
		WRITE(*,*) "  --------------------------------------" 
		WRITE(*,"(4X,A10,F10.4,A2,F12.4,A1)") "X1 =",Coefs(2),"(",&
			Sigma(2),")"
		WRITE(*,*) "  --------------------------------------"
	
	
	END SELECT
	CLOSE(90)
	GO TO 2201
	
909	WRITE(*,*)" Error No.:", ErrorNo

2201 END SUBROUTINE Create_Screen_Output





! ******************************************************************************
! End the Program.
! ******************************************************************************
END PROGRAM IMT
